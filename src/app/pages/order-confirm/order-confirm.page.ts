import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.page.html',
  styleUrls: ['./order-confirm.page.scss'],
})
export class OrderConfirmPage implements OnInit {

  public order: Order;

  constructor(public route: ActivatedRoute, public ordersService: OrdersService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let id = this.route.snapshot.params.id;
    this.order = await this.ordersService.findById(id, ['-__v'])
  }

  getTotal(includeShipping: boolean = true) {
    return this.getTotalProduct() + (this.order && includeShipping ? this.order.shipping_cost : 0);
  }

  getTotalProduct() {
    let total = 0;
    for (let p of this.order.info) {
      total += p.ingredient.price * p.qta;
    }
    return total;
  }
}
