import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OrdersService } from 'src/app/services/orders.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  public orders: Order[] = [];

  constructor(public navCtrl: NavController, private ordersService: OrdersService) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.orders = await this.ordersService.find({}, ['-__v'], 0, 50, '-created');
  }

}
