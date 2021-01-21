import { Component } from '@angular/core';
import { Receipt } from '../models/receipt.model';
import { ReceiptsService } from '../services/receipts.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public receipts: Receipt[] = []

  constructor(private receiptsService: ReceiptsService) {}

  async ionViewWillEnter() {
    try {
      this.receipts = await this.receiptsService.find({}, ['-__v'], 0, 4, { id: 1 }, ['ingredients.ingredient'])
    } catch (error) {
      
    }
  }

}
