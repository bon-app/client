import { Component } from '@angular/core';
import { Receipt } from '../models/receipt.model';
import { ReceiptsService } from '../services/receipts.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { RimsService } from '../services/rims.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoginComponent } from '../components/login/login.component';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public receipts: Receipt[] = [];
  public filter: any = { active: true, verified: true };
  public selected_rim: any;
  public rimsProvider: any;
  public _filter = {
    tags: [],
    active: true,
  };

  public isShow: boolean = true;
  userName: string;
  fromCreator: boolean = false;

  constructor(
    private receiptsService: ReceiptsService,
    private route: ActivatedRoute,
    private rimsService: RimsService,
    private translate: TranslateService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    this.rimsProvider = new RimsDataProvider(rimsService);
  }

  async ionViewWillEnter() {
    await this.getReceipts();
  }

  async getReceipts(event: any = null, force: boolean = false) {
    let skip = force ? 0 : this.receipts.length || 0;
    try {
      skip > 0 && !force
        ? this.loadMoreRecipes(event, skip)
        : this.loadInitialRecipes(event, skip);
    } catch (error) {}
  }

  async loadInitialRecipes(event, skip: number) {
    this.receipts = await this.fetchRecipes(skip);
    if (event) event.target.complete();
  }

  async loadMoreRecipes(event, skip: number) {
    this.receipts.push(...(await this.fetchRecipes(skip)));
    if (event) event.target.complete();
    return;
  }

  async fetchRecipes(skip: number) {
    return await this.receiptsService.findAll(
      this.filter,
      ['-__v'],
      skip,
      12,
      '-priority',
      ['ingredients.ingredient']
    );
  }

  goto(url: string) {
    this.navCtrl.navigateForward(url);
  }

  async onChangeFilter(value) {
    if (this._filter.tags.indexOf(value) > -1) {
      this._filter.tags = this._filter.tags.filter((t) => t != value);
    } else {
      this._filter.tags.push(value);
    }
    await this.createFilter();
  }

  async createFilter() {
    let filter: any = { active: true };
    if (this._filter.tags.length) {
      filter.tags = { $all: this._filter.tags };
    }
    if (this.selected_rim) {
      filter['ingredients.ingredient'] = { $in: [this.selected_rim.id] };
    }
    this.filter = filter;
    await this.getReceipts(null, true);
  }

  selectedRim(rim = null) {
    this.selected_rim = rim;
    this.createFilter();
  }
  async openLoginModal(signin: boolean = false) {
    let modal = await this.modalCtrl.create({
      component: LoginComponent,
      componentProps: {
        section: signin ? 'signin' : 'login',
      },
      cssClass: ['auto-height'],
    });

    modal.present();
  }
}

export class RimsDataProvider implements AutoCompleteService {
  labelAttribute = 'id';
  formValueAttribute = '_name';
  field;

  constructor(private service: RimsService) {}

  async getResults(keyword: string) {
    if (!keyword) {
      return false;
    }

    // if(keyword first value == @ ,search in the users endpoint)

    return (
      await this.service.find(
        { name: { $regex: `.*${keyword}.*`, $options: 'i' } },
        ['-__v'],
        0,
        25,
        { name: 1 }
      )
    ).filter((item) => {
      (<any>item)._name = item.name;
      return item;
    });
  }
}
