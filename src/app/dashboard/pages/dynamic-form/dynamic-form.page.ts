import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { EntityConfig } from '../../../lib/dynamic-forms/core/entity.config';
import {
  ENTITIES_MAPPER,
  SERVICES_MAPPER,
} from '../../../lib/dynamic-forms/core/mapper';
import { CRUDService } from '../../../services/crud.service';
import { ENTITIES } from '../entities/entities.config';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.page.html',
  styleUrls: ['./dynamic-form.page.scss'],
})
export class DynamicFormPage implements OnInit {
  @Input('model') model: any = {};
  @Input('config') config: EntityConfig;

  public service: CRUDService<any>;
  entity: any;
  id: string;
  // updatedUser: any;

  constructor(
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private injector: Injector,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // console.log('dynamic-form ngOnInit:', this.model)
  }

  async ionViewWillEnter() {
    this.entity = this.route.snapshot.params.entity;
    this.id = this.route.snapshot.params.id;
    this.config = ENTITIES[this.entity];

    this.service = this.injector.get(SERVICES_MAPPER.get(this.config.service));

    this.id ? this.editModel() : this.newModel();
  }

  newModel() {
    this.model = new (ENTITIES_MAPPER.get(this.config.object))();
  }

  async editModel() {
    let findOptions = this.config.crudOptions.findOne || {};

    await this.fetchById(findOptions).then((response) => {
      this.model = response;
    });
  }

  async save($event) {
    let findOptions = this.config.crudOptions.findOne || {};

    let loading = await this.loadingCtrl.create({ message: 'loading...' });
    loading.present();

    try {
      let model = JSON.parse(JSON.stringify(this.model));
      model = this.config.validateModel(model);

      $event.id
        ? await this.editEntry(findOptions, model)
        : await this.newEntry(loading, model);

      await this.successToast();
      this.navCtrl.navigateForward(`/`);
    } catch (error) {
      this.failToast(error);
    }
    loading.dismiss();
  }

  async newEntry(loading: HTMLIonLoadingElement, model) {
    await this.service.add(model);
    loading.dismiss();
    this.navCtrl.back();
    return;
  }

  async editEntry(findOptions, model) {
    let fields: string[] = this.config.fields.map((f) => f.key) as string[];
    await this.service.update(model, fields, fields);

    if (this.entity === 'profile') {
      await this.updateUserCredentials(findOptions);
    }
  }

  async updateUserCredentials(findOptions) {
    let identity = this.auth.getIdentity();
    const { checksum, exp, iat } = identity;

    await this.fetchById(findOptions).then((fetchedUserDetails) => {
      let updatedUserCredentials = {
        ...fetchedUserDetails,
        checksum,
        exp,
        iat,
      };

      this.auth.setIdentity(null);
      this.auth.setIdentity(updatedUserCredentials);
    });
  }

  async fetchById(findOptions) {
    return await this.service.findById(
      this.id,
      findOptions.fields || ['-__v'],
      findOptions.includes
    );
  }

  async successToast() {
    let toast = await this.toastCtrl.create({
      message: 'Successfully updated',
      duration: 3000,
    });
    toast.present();
  }

  async failToast(error) {
    let toast = await this.toastCtrl.create({
      message: error.error.code,
      duration: 2000,
    });
    toast.present();
  }
}
