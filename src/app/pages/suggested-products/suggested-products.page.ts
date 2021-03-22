import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-suggested-products',
  templateUrl: './suggested-products.page.html',
  styleUrls: ['./suggested-products.page.scss'],
})
export class SuggestedProductsPage implements OnInit {

  public categories: Category[] = [];

  constructor(public cart: CartService, public categoriesService: CategoriesService, public navCtrl: NavController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.categories = await this.categoriesService.find({ showBeforeCheckout: true }, ['-__v'], 0, 50, { name: 1 }, ['ingredients', 'subcategories']);
  }

  goto(url: string) {
    this.navCtrl.navigateForward(url);
  }

  getIngredients(category) {
    return category.ingredients;
  }
} 
