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
  updatedUser: any;

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
    let entity = this.route.snapshot.params.entity;
    let id = this.route.snapshot.params.id;
    this.config = ENTITIES[entity];
    // this.model = new (ENTITIES_MAPPER.get(this.config.object))();
    this.service = this.injector.get(SERVICES_MAPPER.get(this.config.service));
    // console.log('dynamic-form ionViewWillEnter:',this.model)

    if (!id) {
      this.model = new (ENTITIES_MAPPER.get(this.config.object))();
    } else {
      let findOptions = this.config.crudOptions.findOne || {};
      this.model = await this.service.findById(
        id,
        findOptions.fields || ['-__v'],
        findOptions.includes
      );
      // console.log('dynamic-form ionViewWillEnter if (id):',this.model)
    }
    console.log('dynamic-form ionViewWillEnter if (id):', this.model);
  }

  async save($event) {
    // console.log();
    let id = this.route.snapshot.params.id;
    let findOptions = this.config.crudOptions.findOne || {};
    let entity = this.route.snapshot.params.entity;

    let loading = await this.loadingCtrl.create({ message: 'loading...' });
    loading.present();

    try {
      let model = JSON.parse(JSON.stringify(this.model));
      model = this.config.validateModel(model);
      if (!$event.id) {
        await this.service.add(model);
        loading.dismiss();
        this.navCtrl.back();
        return;
      }

      let fields: string[] = this.config.fields.map((f) => f.key) as string[];
      // if (this.auth.hasRoles(['admin'])) {
      //   fields = fields.filter(f => f != 'fk_user');
      // }
      // console.log('dynamic-form save($event)', this.model);
      await this.service.update(model, fields, fields);

      if ((entity = 'profile')) {
        let identity = this.auth.getIdentity();
        let checksum = identity.checksum;
        let exp = identity.exp;
        let iat = identity.iat;

        this.updatedUser = await this.service.findById(
          id,
          findOptions.fields || ['-__v'],
          findOptions.includes
        );

        let updatedUser = { ...this.updatedUser, checksum };
        // let updatedUser = { ...this.updatedUser, checksum, exp, iat };
        // console.log(updatedUser);

        this.auth.setIdentity(null);
        this.auth.setIdentity(updatedUser);
      }

      loading.dismiss();
      this.successToast();
      this.navCtrl.navigateForward(`/`);
    } catch (error) {
      this.failToast(error);
      loading.dismiss();
    }
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
