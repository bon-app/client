import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { CartDetailsComponent } from '../cart-details/cart-details.component';

@Component({
  selector: 'footer-cart',
  templateUrl: './footer-cart.component.html',
  styleUrls: ['./footer-cart.component.scss'],
})
export class FooterCartComponent implements OnInit {

  @Input("order") order: Order;
  @Input("options") options: {
    confirm_button_text?: string
    button_disabled?: boolean
  }
  @Output("confirm") confirm: EventEmitter<any> = new EventEmitter<any>();

  constructor(public cart: CartService, private modalCtrl: ModalController) { }

  ngOnInit() { }

  async cartDetails() {
    let modal = await this.modalCtrl.create({
      component: CartDetailsComponent,
      componentProps: {
        order: this.order
      },
      cssClass: "auto-height flex-end top-round",
    });
    modal.present();
  }

  getTotal() {
    return this.cart.total + (this.order ? (this.order.delivery_method == 'standard' ? 0.99 : 2.49) : 0);
  }

  getQta() {
    return this.cart.items.map(i => i.qta).reduce((n, c) => n + c, 0);
  }

  getButtonDisabled() {
    if (this.options && typeof this.options.button_disabled === 'boolean') {
      return this.options.button_disabled;
    }
    return false;
  }

}
