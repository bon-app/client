import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public _items: { [key: string]: { ingredient: Ingredient, qta: number } } = {};
  public get items(): { ingredient: Ingredient, qta: number }[] {
    let items = []
    for (let key in this._items) {
      items.push(this._items[key]);
    }
    return items;
  }
  public get total() {
    let total: number = 0;
    for (let key in this._items) {
      total += this._items[key].qta * this._items[key].ingredient.price;
    }
    return total;
  }
  public created: Date = new Date();
  public edited: Date = new Date();

  constructor() {
    if (sessionStorage.getItem('cart')) {
      Object.assign(this, JSON.parse(sessionStorage.getItem('cart')))
    }
  }

  clear() {
    this._items = {};
    sessionStorage.removeItem("cart");

  }

  getQta(ingredient: Ingredient) {
    return this._items[ingredient.id] ? this._items[ingredient.id].qta || 0 : 0;
  }

  add(ingredient: Ingredient, qta: number) {
    if (!this._items[ingredient.id]) {
      this._items[ingredient.id] = { ingredient, qta: 0 };
    }

    this._items[ingredient.id].qta += qta;

    if (this._items[ingredient.id].qta < 1) {
      delete this._items[ingredient.id]
    }

    sessionStorage.setItem("cart", JSON.stringify({ _items: this._items, created: this.created, edited: this.edited }))
  }

  set(ingredient: Ingredient, qta: number) {
    this._items[ingredient.id] = { ingredient, qta };
  }

}
