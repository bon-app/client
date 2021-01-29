import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FieldType } from '@ngx-formly/core';
import { DynamicOneRelationComponent } from '../dynamic-one-relation/dynamic-one-relation.component';

@Component({
  selector: 'app-one-relation',
  templateUrl: './one-relation.component.html',
  styleUrls: ['./one-relation.component.scss'],
})
export class OneRelationComponent extends FieldType implements OnInit {

  constructor(private modalCtrl: ModalController) {
    super();
  }

  ngOnInit() { }


  async openModal() {
    let modal = await this.modalCtrl.create({
      component: DynamicOneRelationComponent,
      componentProps: {
        item: this.model[this.field.key as string],
        field: this.field
      },
      backdropDismiss: false,
      swipeToClose: false,
      cssClass: ['auto-height']
    });

    modal.present();

    modal.onDidDismiss().then((res: { data: any }) => {
      if (res.data) {
        this.model[this.field.key as string] = res.data;
      }
    })
  }

}
