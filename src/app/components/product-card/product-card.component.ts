import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Ingredient } from 'src/app/models/ingredient.model';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {

  @Input("product") product: Ingredient[] = []

  constructor(
    public cart: CartService,
  ){}

  ngOnInit() { }

  getSelf(obj) {
    return obj as any;
  }

}
