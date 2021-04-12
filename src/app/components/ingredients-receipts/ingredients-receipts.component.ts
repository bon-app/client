import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { Ingredient } from 'src/app/models/ingredient.model';
import { IngredientsService } from 'src/app/services/ingredients.service';
import { RimsService } from 'src/app/services/rims.service';

@Component({
  selector: 'app-ingredients-receipts',
  templateUrl: './ingredients-receipts.component.html',
  styleUrls: ['./ingredients-receipts.component.scss'],
})
export class IngredientsReceiptsComponent implements OnInit {

  
  @Input("items") items: { qta: string, ingredient: Ingredient }[] = [];

  constructor(private modalCtrl: ModalController, public ingredientDataProvider: IngredientDataProvider, private toastCtrl: ToastController) { }

  ngOnInit() { }

  async addIngredient($event: Ingredient) {
    if (!!this.items.map(i => i.ingredient).find(i => i.id == $event.id || (i as any)._id == $event.id)) {
      let toast = await this.toastCtrl.create({ message: "Element already present in the list!", duration: 5000 });
      toast.present();
      return;
    }
    this.items.push({ qta: "q.b.", ingredient: $event });
  }

  removeIngredient($event: Ingredient) {
    this.items = this.items.filter(i => i.ingredient.id != $event.id)
  }

  save() {
    this.modalCtrl.dismiss(this.items);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}

@Injectable({
  providedIn: 'root'
})
export class IngredientDataProvider implements AutoCompleteService {
  labelAttribute = 'id';
  formValueAttribute = '_name';

  constructor(private ingredientsService: IngredientsService) {

  }

  async getResults(keyword: string) {
    if (!keyword) { return false; }

    let results = await this.ingredientsService.find({ name: { $regex: `.*${keyword}.*`, $options: 'i' } }, ['-__v'], 0, 5, { name: 1 });
    for(let r of results) {
      (<any>r)._name = `${r.name} - ${r.brand} - ${(<any>r).qty}`
    }
    return results;
  }
}