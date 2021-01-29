import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ENTITIES_MAPPER, EntityConfig, SERVICES_MAPPER } from '../../../lib/dynamic-forms/core';
import { CRUDService } from '../../../services/crud.service';
import { ENTITIES } from "../entities/entities.config";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.page.html',
  styleUrls: ['./dynamic-form.page.scss'],
})
export class DynamicFormPage implements OnInit {

  @Input("model") model: any = {};
  @Input("config") config: EntityConfig;

  public service: CRUDService<any>;

  constructor(private route: ActivatedRoute, private injector: Injector, public navCtrl: NavController) {

  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let entity = this.route.snapshot.params.entity;
    let id = this.route.snapshot.params.id;
    this.config = ENTITIES[entity];
    this.model = new (ENTITIES_MAPPER.get(this.config.object))();
    this.service = this.injector.get(SERVICES_MAPPER.get(this.config.service));

    if (id) {
      let findOptions = this.config.crudOptions.find || {};
      this.model = await this.service.findById(id, findOptions.fields || ['-__v'], findOptions.includes);
    }
  }

  async save($event) {

    let model = JSON.parse(JSON.stringify(this.model));
    model = this.config.validateModel(model);
    if (!$event.id) {
      await this.service.add(model);
      this.navCtrl.back();
      return;
    }

    let fields: string[] = this.config.fields.map(f => f.key) as string[];
    await this.service.update(model, fields, fields);
    this.navCtrl.back();
  }

}
