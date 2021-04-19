import { Component, Injectable, Injector, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { SERVICES_MAPPER } from '../../../core/mapper';

@Component({
  selector: 'app-dynamic-many-relation',
  templateUrl: './dynamic-many-relation.component.html',
  styleUrls: ['./dynamic-many-relation.component.scss'],
})
export class DynamicManyRelationComponent implements OnInit {

  @Input("items") items: any[] = [];
  public manyRelationDataProvider: ManyRelationDataProvider;
  public service: any;
  public field: FormlyFieldConfig;

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController, private injector: Injector) {
  }

  ngOnInit() {
    this.service = this.injector.get(SERVICES_MAPPER.get(this.field.templateOptions.service));
    this.manyRelationDataProvider = new ManyRelationDataProvider(this.service);
    this.manyRelationDataProvider.field = this.field;
  }

  async add($event: any) {
    if (!!this.items.find(i => i.id == $event.id || (i as any)._id == $event.id)) {
      let toast = await this.toastCtrl.create({ message: "Element already present in the list!", duration: 5000 });
      toast.present();
      return;
    }
    this.items.push($event);
  }

  remove($event: any) {
    this.items = this.items.filter(i => i.id != $event.id)
  }

  save() {
    this.modalCtrl.dismiss(this.items);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  label(item) {
    return eval(this.field.templateOptions.selected_key || 'item.name')
  }

}


export class ManyRelationDataProvider implements AutoCompleteService {
  labelAttribute = 'id';
  formValueAttribute = '_name';
  field;

  constructor(private service: any) {

  }

  async getResults(keyword: string) {
    if (!keyword) { return false; }

    return (await this.service.find({ name: { $regex: `.*${keyword}.*`, $options: 'i' } }, ['-__v'], 0, 50, { name: 1 })).filter(item => {
      item._name = eval(this.field.templateOptions.selected_key || 'item.name')
      return item;
    })
  }
}