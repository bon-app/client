import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FieldType } from '@ngx-formly/core';
import { Ingredient } from 'src/app/models/ingredient.model';
import { IngredientsComponent } from '../../ingredients/ingredients.component';

@Component({
  selector: 'app-df-ingredients',
  templateUrl: './df-ingredients.component.html',
  styleUrls: ['./df-ingredients.component.scss'],
})
export class DFIngredientsComponent extends FieldType implements OnInit {

  constructor(private modalCtrl: ModalController) {
    super();
  }

  ngOnInit() { }


  async openModal() {
    let modal = await this.modalCtrl.create({
      component: IngredientsComponent,
      componentProps: {
        items: this.model.ingredients
      },
      backdropDismiss: false,
      swipeToClose: false,
      cssClass: ['auto-height']
    });

    modal.present();

    modal.onDidDismiss().then((res: { data: Ingredient[] }) => {
      if (res.data) {
        this.model.ingredients = res.data;
      }
    })
  }

}
