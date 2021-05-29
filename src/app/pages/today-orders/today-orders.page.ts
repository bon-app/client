import { Component, OnInit } from "@angular/core";
import { Order } from "src/app/models/order.model";
import { OrdersService } from "src/app/services/orders.service";
import { NavController } from '@ionic/angular';

@Component({
	selector: "app-today-orders",
	templateUrl: "./today-orders.page.html",
	styleUrls: ["./today-orders.page.scss"],
})
export class TodayOrdersPage implements OnInit {
	public orders: Order[] = [];

	constructor(private ordersService: OrdersService, public navCtrl: NavController) {}

	async ionViewWillEnter() {
		let start = new Date();
		let end = new Date(start);
		start.setHours(0, 0, 1);
		end.setHours(23, 59, 59);
		this.orders = await this.ordersService.find({ created: { $gte: start, $lte: end } }, ["-__v"], 0, 1000, "-created");
	}

	ngOnInit() {
		console.log('this.orders:',this.orders)
	}
}

