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
  public filter: any = {};
  public _filter = {
    tags: []
  }

  constructor(private receiptsService: ReceiptsService) { }

  async ionViewWillEnter() {
    await this.getReceipts();
  }

  async getReceipts() {
    try {
      this.receipts = await this.receiptsService.find(this.filter, ['-__v'], 0, 4, { id: 1 }, ['ingredients.ingredient'])
    } catch (error) {

    }
  }

  async onChangeFilter(value) {
    if (this._filter.tags.indexOf(value) > -1) {
      this._filter.tags = this._filter.tags.filter(t => t != value);
    } else {
      this._filter.tags.push(value);
    }
    await this.createFilter();
  }

  async createFilter() {
    this.filter = this._filter.tags.length ? { tags: { $elemMatch: { $in: this._filter.tags } } } : {};
    await this.getReceipts();
  }

}
