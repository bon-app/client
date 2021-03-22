import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CRUDService } from '../../../services/crud.service';
import { EntityConfig } from '../../../lib/dynamic-forms/core/entity.config';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ENTITIES } from '../entities/entities.config';
import { DynamicListComponent } from '../../../lib/dynamic-forms/components/dynamic-list/dynamic-list.component';
import { SERVICES_MAPPER } from '../../../lib/dynamic-forms/core/mapper';

@Component({
  selector: 'app-dynamic-list',
  templateUrl: './dynamic-list.page.html',
  styleUrls: ['./dynamic-list.page.scss'],
})
export class DynamicListPage implements OnInit {

  @ViewChild('list', { static: false }) list: DynamicListComponent;

  @Input("config") config: EntityConfig;
  @Input("data") data: any[] = [];

  public settings: { row_length: number, showMoreButton: boolean } = { row_length: 50, showMoreButton: true };
  public entity: string;
  private service: CRUDService<any>;


  constructor(private route: ActivatedRoute,
    private injector: Injector,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    let entity = this.route.snapshot.params.entity;
    this.entity = entity
    this.config = ENTITIES[entity];

    this.service = this.injector.get(SERVICES_MAPPER.get(this.config.service));
    let findOptions = this.config.crudOptions.find || {};
    this.data = await this.service.find({}, findOptions.fields || ['-__v'], 0, this.settings.row_length, findOptions.orderBy, findOptions.includes);
    if (this.data.length < this.settings.row_length) {
      this.settings.showMoreButton = false;
    }
  }

  async ionViewDidEnter() {
    let entity = this.route.snapshot.params.entity;
    this.entity = entity
    this.config = ENTITIES[entity];

    this.service = this.injector.get(SERVICES_MAPPER.get(this.config.service));
    this.getRecords(true);
  }

  goto(url) {
    this.navCtrl.navigateForward(url);
  }

  async deleteElement($event) {
    if (confirm(`Are you sure you want to delete the "${$event.name}" element?`)) {
      console.log($event);
      await this.service.delete($event.id);
      this.data = this.data.filter(d => d.id != $event.id);
    }

  }

  //@Debounce(300)
  async getRecords(clear: boolean = false) {
    try {
      let findOptions = this.config.crudOptions.find || {};
      let data = await this.service.find(this.list.filter, findOptions.fields || ['-__v'], clear ? 0 : this.data.length, this.settings.row_length, findOptions.orderBy, findOptions.includes);
      //if (data.length < this.settings.row_length) {
      this.settings.showMoreButton = true;
      //}
      if (clear) {
        this.data = data;
        return;
      }
      this.data.push(...data);
    } catch (error) {

    }
  }

  handleExtraButtons($event: { key: string, data: any }) {
    switch ($event.key) {
      case 'importFromCSV':
        console.log("Upload CSV");
        document.querySelector<HTMLInputElement>('#import-csv').click()
        break;
      case 'copy-url':
        console.log("Copy URL", $event);
        this.copyToClipboard($event.data.id);
        break;

      default:
        break;
    }
  }

  copyToClipboard(value: string) {
    // debugger
    // let copyText = document.querySelector<HTMLInputElement>('#copy')
    // copyText.value = value;
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); /* For mobile devices */
    // document.execCommand("copy");
  }

  async importCSV($event) {

    let loading = await this.loadingCtrl.create({ message: "Importing..." });
    await loading.present()

    let input = $event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = async (e) => {
        let elements = (e.target.result as string).split(/\r\n|\n|\r/);
        let ingredients = []
        for (let el of elements) {
          let fields = el.split(';');
          let ingredient = {
            icon_url: fields[0],
            name: fields[1],
            brand: fields[2],
            qty: fields[3],
            price: Math.floor(parseFloat(fields[4]) * 100) / 100,
            active: !!fields[5],
            matchingName: fields[6],
            priority: parseInt(fields[7] || '999'),
            category: fields[8],
          }
          ingredients.push(ingredient);
        }
        input.value = '';
        await (<any>this.service).importCSV(ingredients.filter(i => i.icon_url != 'icon_url'));
        await loading.dismiss()

        let toast = await this.toastCtrl.create({ message: `${ingredients.length} ingredients imported!`, duration: 3500, cssClass: ['toast-alert'] });
        toast.present();

        this.getRecords(true);
      }
      reader.readAsText(input.files[0], "UTF-8");
    }

  }
}
