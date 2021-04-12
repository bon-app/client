import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { IngredientsService } from 'src/app/services/ingredients.service';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-ingredients-priority',
  templateUrl: './ingredients-priority.component.html',
  styleUrls: ['./ingredients-priority.component.scss'],
})
export class IngredientsPriorityComponent implements OnInit {

  @Input("items") items: { priority: number, ingredient: Ingredient }[] = [];

  constructor(private modalCtrl: ModalController, public ingredientDataProvider: IngredientDataProvider, private toastCtrl: ToastController) { }

  ngOnInit() { }

  async addIngredient($event: Ingredient) {
    if (!!this.items.map(i => i.ingredient).find(i => i.id == $event.id || (i as any)._id == $event.id)) {
      let toast = await this.toastCtrl.create({ message: "Element already present in the list!", duration: 5000 });
      toast.present();
      return;
    }
    this.items.push({ priority: this.items.length - 1, ingredient: $event });
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

  reorderItems(ev) {
    const itemMove = this.items.splice(ev.detail.from, 1)[0];
    this.items.splice(ev.detail.to, 0, itemMove);
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].priority = i;
    }
    ev.detail.complete();
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