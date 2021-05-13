import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Order } from '../../models/order.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
})
export class CartDetailsComponent implements OnInit {

  @Input('order') order: Order;

  constructor(public cart: CartService, public modalCtrl: ModalController) { }

  ngOnInit() { }

  getTotal() {
    return this.cart.total + (this.order ? (this.order.delivery_method == 'standard' ? 0.99 : 2.49) : 0);
  }
}
