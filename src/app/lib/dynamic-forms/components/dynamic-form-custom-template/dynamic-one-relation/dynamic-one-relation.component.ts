import { Component, Injector, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { SERVICES_MAPPER } from '../../../core/mapper';

@Component({
  selector: 'app-dynamic-one-relation',
  templateUrl: './dynamic-one-relation.component.html',
  styleUrls: ['./dynamic-one-relation.component.scss'],
})
export class DynamicOneRelationComponent implements OnInit {


  @Input("item") item: any = {name: 'not work'};
  public oneRelationDataProvider: OneRelationDataProvider;
  public service: any;
  public field: FormlyFieldConfig;

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController, private injector: Injector) {
  }

  ngOnInit() {
    this.service = this.injector.get(SERVICES_MAPPER.get(this.field.templateOptions.service));
    this.oneRelationDataProvider = new OneRelationDataProvider(this.service);
  }

  async add($event: any) {
    this.item = $event;
  }

  remove($event: any) {
    this.item = null;
  }

  save() {
    this.modalCtrl.dismiss(this.item);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  label(item) {
    return eval(this.field.templateOptions.selected_key || 'item.id')
  }

}


export class OneRelationDataProvider implements AutoCompleteService {
  labelAttribute = 'id';
  formValueAttribute = 'name';

  constructor(private service: any) {

  }

  async getResults(keyword: string) {
    if (!keyword) { return false; }

    return (await this.service.find({ name: { $regex: `.*${keyword}.*`, $options: 'i' } }, ['-__v'], 0, 5, { name: 1 }))
  }
}