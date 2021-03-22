import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FieldType } from '@ngx-formly/core';
import { DynamicManyRelationComponent } from '../dynamic-many-relation/dynamic-many-relation.component';

@Component({
  selector: 'app-many-relation',
  templateUrl: './many-relation.component.html',
  styleUrls: ['./many-relation.component.scss'],
})
export class ManyRelationComponent extends FieldType implements OnInit {

  constructor(private modalCtrl: ModalController) {
    super();
  }

  ngOnInit() { }


  async openModal() {
    let modal = await this.modalCtrl.create({
      component: DynamicManyRelationComponent,
      componentProps: {
        items: this.model[this.field.key as string],
        field: this.field
      },
      backdropDismiss: false,
      swipeToClose: false,
      cssClass: ['auto-height']
    });

    modal.present();

    modal.onDidDismiss().then((res: { data: any[] }) => {
      if (res.data) {
        this.model[this.field.key as string] = res.data;
      }
    })
  }

}
