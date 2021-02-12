import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CRUDService } from '../../../services/crud.service';
import { EntityConfig } from '../../../lib/dynamic-forms/core/entity.config';
import { NavController } from '@ionic/angular';
import { DynamicListComponent } from '../../../lib/dynamic-forms/components';
import { SERVICES_MAPPER } from '../../../lib/dynamic-forms/core';
import { ENTITIES } from '../entities/entities.config';

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


  constructor(private route: ActivatedRoute, private injector: Injector, private navCtrl: NavController) { }

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
    console.log($event);
    await this.service.delete($event.id);
    this.data = this.data.filter(d => d.id != $event.id);

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

  importCSV($event) {

    let input = $event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
        let elements = (e.target.result as string).split(/\r\n|\n|\r/);
        let ingredients = []
        for (let el of elements) {
          let fields = el.split(';');
          let ingredient = {
            icon_url: fields[0],
            name: fields[1],
            brand: fields[2],
            price: Math.floor(parseFloat(fields[3]) * 100) / 100,
            active: !!fields[4],
            matchingName: fields[5],
            priority: parseInt(fields[6] || '999'),
            category: fields[7],
          }
          ingredients.push(ingredient);
        }
        input.value = '';
        (<any>this.service).importCSV(ingredients.filter(i => i.icon_url != 'icon_url'));
        this.getRecords(true);
      }
      reader.readAsText(input.files[0], "UTF-8");
    }

  }
}
