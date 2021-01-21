import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'choose-ingredients',
  templateUrl: './choose-ingredients.component.html',
  styleUrls: ['./choose-ingredients.component.scss'],
})
export class ChooseIngredientsComponent implements OnInit {

  @Input('ingredients') ingredients: { id: string, name: string, icon_url: string, active?: boolean }[] = [
    { id: "ASPARAGUS", name: 'Ingredients.asparagus', icon_url: 'assets/ingredients/asparagus.svg' },
    { id: "AVOCADO", name: 'Ingredients.avocado', icon_url: 'assets/ingredients/avocado.svg' },
    { id: "BEEF", name: 'Ingredients.beef', icon_url: 'assets/ingredients/beef.svg' },
    { id: "BROCCOLI", name: 'Ingredients.broccoli', icon_url: 'assets/ingredients/broccoli.svg' },
    { id: "CHICKEN", name: 'Ingredients.chicken', icon_url: 'assets/ingredients/chicken.svg' },
    { id: "EGG", name: 'Ingredients.egg', icon_url: 'assets/ingredients/egg.svg' },
    { id: "GORGONZOLA", name: 'Ingredients.gorgonzola', icon_url: 'assets/ingredients/gorgonzola.svg' },
    { id: "MOZZARELLA", name: 'Ingredients.mozzarella', icon_url: 'assets/ingredients/mozzarella.svg' },
    { id: "PASTA", name: 'Ingredients.pasta', icon_url: 'assets/ingredients/pasta.svg' },
    { id: "PESTO", name: 'Ingredients.pesto', icon_url: 'assets/ingredients/pesto.svg' },
    { id: "PORK", name: 'Ingredients.pork', icon_url: 'assets/ingredients/pork.svg' },
    { id: "SALMON", name: 'Ingredients.salmon', icon_url: 'assets/ingredients/tuna.svg' },
    { id: "WHEAT", name: 'Ingredients.wheat', icon_url: 'assets/ingredients/wheat.svg' },
    { id: "ZUCCHINI", name: 'Ingredients.zucchini', icon_url: 'assets/ingredients/zucchini.svg' },
  ]

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  canStartSearch() {
    return !!this.ingredients.find(i => i.active);
  }

  searchReceipts() {
    this.navCtrl.navigateForward("/receipts", { state: { filter: this.ingredients.filter(i => i.active) } });
  }

}
