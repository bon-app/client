import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FieldType } from '@ngx-formly/core';
import { Ingredient } from 'src/app/models/ingredient.model';
import { IngredientsPriorityComponent } from '../../ingredients-priority/ingredients-priority.component';

@Component({
  selector: 'ingredients-priority',
  templateUrl: './ingredients-priority.component.html',
  styleUrls: ['./ingredients-priority.component.scss'],
})
export class DFIngredientsPriorityComponent extends FieldType implements OnInit {

  constructor(private modalCtrl: ModalController) {
    super();
  }

  ngOnInit() {
  }

  async openModal() {
    let rim = this.model;
    let modal = await this.modalCtrl.create({
      component: IngredientsPriorityComponent,
      componentProps: {
        items: rim.ingredients
      },
      backdropDismiss: false,
      swipeToClose: false,
      cssClass: ['auto-height']
    });

    modal.present();

    modal.onDidDismiss().then((res: { data: { priority: number, ingredient: Ingredient }[] }) => {
      if (res.data) {
        rim.ingredients = res.data;
      }
    })
  }

}
