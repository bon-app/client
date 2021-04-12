import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { Ingredient } from 'src/app/models/ingredient.model';
import { IngredientsService } from 'src/app/services/ingredients.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
})
export class IngredientsComponent implements OnInit {

  @Input("items") items: Ingredient[] = [];

  constructor(private modalCtrl: ModalController, public ingredientDataProvider: IngredientDataProvider, private toastCtrl: ToastController) { }

  ngOnInit() { }

  async addIngredient($event: Ingredient) {
    if (!!this.items.find(i => i.id == $event.id || (i as any)._id == $event.id)) {
      let toast = await this.toastCtrl.create({ message: "Element already present in the list!", duration: 5000 });
      toast.present();
      return;
    }
    this.items.push($event);
  }

  removeIngredient($event: Ingredient) {
    this.items = this.items.filter(i => i.id != $event.id)
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