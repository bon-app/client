import { Component, Input, OnInit } from '@angular/core';
import { ReceiptsService } from '../../services/receipts.service';
import { Receipt } from '../../models/receipt.model';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.page.html',
  styleUrls: ['./receipt-list.page.scss'],
})
export class ReceiptListPage implements OnInit {

  @Input('filter') filter: any = {};
  @Input('receipts') receipts: Receipt[] = [];

  constructor(private receiptsService: ReceiptsService, public navCtrl: NavController, private router: Router) { }

  async ngOnInit() {
    this.receipts = await this.receiptsService.find(this.filter, ['-__v'], 0, 8, { name: 1 }, ['ingredients.ingredient']);
  }

}
