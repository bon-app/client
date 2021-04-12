import { Component } from '@angular/core';
import { Receipt } from '../models/receipt.model';
import { ReceiptsService } from '../services/receipts.service';
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public receipts: Receipt[] = []
  public filter: any = { active: true };
  public _filter = {
    tags: [],
    active: true
  }

  public isShow: boolean = true;

  constructor(private receiptsService: ReceiptsService, private translate: TranslateService) { }

  async ionViewWillEnter() {
    await this.getReceipts();

  }

  async getReceipts(event: any = null, force: boolean = false) {
    let skip = force? 0 : this.receipts.length || 0;
    try {
      if (skip > 0 && !force) {
        this.receipts.push(...(await this.receiptsService.find(this.filter, ['-__v'], skip, 12, '-priority', ['ingredients.ingredient'])));
        if (event) event.target.complete();
        return
      }
      this.receipts = await this.receiptsService.find(this.filter, ['-__v'], skip, 12, '-priority', ['ingredients.ingredient'])
      if (event) event.target.complete();

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
    // this.filter = this._filter.tags.length ? { tags: { $elemMatch: { $in: this._filter.tags } } } : {};
    this.filter = this._filter.tags.length ? { active: true, tags: { $all: this._filter.tags } } : { active: true, };
    await this.getReceipts(null, true);
  }

}
