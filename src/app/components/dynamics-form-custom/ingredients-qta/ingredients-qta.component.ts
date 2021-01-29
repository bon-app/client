import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FieldType } from '@ngx-formly/core';
import { Ingredient } from 'src/app/models/ingredient.model';
import { IngredientsReceiptsComponent } from '../../ingredients-receipts/ingredients-receipts.component';

@Component({
  selector: 'app-ingredients-qta',
  templateUrl: './ingredients-qta.component.html',
  styleUrls: ['./ingredients-qta.component.scss'],
})
export class IngredientsQtaComponent extends FieldType implements OnInit {

  constructor(private modalCtrl: ModalController) {
    super();
  }

  ngOnInit() {
  }

  async openModal() {
    let rim = this.model;
    let modal = await this.modalCtrl.create({
      component: IngredientsReceiptsComponent,
      componentProps: {
        items: rim.ingredients
      },
      backdropDismiss: false,
      swipeToClose: false,
      cssClass: ['auto-height']
    });

    modal.present();

    modal.onDidDismiss().then((res: { data: { qta: string, ingredient: Ingredient }[] }) => {
      if (res.data) {
        rim.ingredients = res.data;
      }
    })
  }

}
