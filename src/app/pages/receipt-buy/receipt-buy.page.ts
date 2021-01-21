import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { CartService } from '../../services/cart.service';
import { Ingredient } from '../../models/ingredient.model';
import { Receipt } from '../../models/receipt.model';
import { NavController } from '@ionic/angular';
import { ReceiptIngredientsMatching } from 'src/app/models/receipt-ingredientsMatching.model';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { IngredientsService } from 'src/app/services/ingredients.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receipt-buy',
  templateUrl: './receipt-buy.page.html',
  styleUrls: ['./receipt-buy.page.scss'],
})
export class ReceiptBuyPage implements OnInit {

  public categories: Category[] = [
    { id: 'a', name: "Acqua", ingredients: [] },
    { id: 'sf', name: "Salumi e formaggi", ingredients: [] },
    { id: 'cm', name: "Colazione e merenda", ingredients: [] },
    { id: 'ull', name: "Uova, latte e latticini", ingredients: [] },
    { id: 'fv', name: "Frutta e verdera", ingredients: [] },
    { id: 'pr', name: "Pasta e riso", ingredients: [] },
    { id: 'pft', name: "Pane, focaccia e taralli", ingredients: [] },
    { id: 'cp', name: "Carne e pesce", ingredients: [] },
    { id: 'sc', name: "Sughi e condimenti", ingredients: [] },
    { id: 'pps', name: "Piatti pronti e snacks", ingredients: [] },
    { id: 'gec', name: "Gelati e Congelati", ingredients: [] },
    { id: 'altro', name: "Altro", ingredients: [] },
  ];

  public selectedCategories: Category[] = [];
  public receipt: Receipt;

  constructor(
    public cart: CartService,
    public receiptsService: ReceiptsService,
    private ingredientsService: IngredientsService,
    public navCtrl: NavController,
    public route: ActivatedRoute) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    try {
      let receipt = await this.receiptsService.findById(this.route.snapshot.params.id, ['-__v'], ['ingredients.ingredient'])
      let ingrs = receipt.ingredients.map((i: any) => i.ingredient.ingredients[0] ? i.ingredient.ingredients[0].ingredient : null).filter(i => i != null);
      let ingredients = await this.ingredientsService.find({ $expr: { $in: [{ $toString: '$_id' }, ingrs] } }, ['-__v'], 0, 200, { name: 1 })
      for (let i of receipt.ingredients) {
        for (let i1 of (i.ingredient as ReceiptIngredientsMatching).ingredients) {
          let ingr: string = i1.ingredient as string;
          i1.ingredient = ingredients.find(ing => ing.id == ingr);
        }
      }
      this.receipt = receipt;
    } catch (error) {
      console.error(error)
    }
  }

  getIngredients(isCondiment: boolean = null) {

    let ingredients = []
    for (let i of this.receipt.ingredients) {
      let rim = i.ingredient as ReceiptIngredientsMatching;
      if (isCondiment !== null && rim.isCondiment != isCondiment) {
        continue;
      }
      let first = rim.ingredients.sort((a, b) => a.priority - b.priority)[0];
      if (first) {
        ingredients.push(first.ingredient);
      }
    }

    return ingredients;
  }

  goto(url: string) {
    this.navCtrl.navigateForward(url);
  }

  toggleCategory(category: Category) {
    if (!!this.selectedCategories.find(sc => sc.id == category.id)) {
      this.selectedCategories = this.selectedCategories.filter(sc => sc.id != category.id);
      return;
    }
    this.selectedCategories.push(category);
  }

  isCategorySelected(category: Category) {
    return !!this.selectedCategories.find(sc => sc.id == category.id);
  }

}
