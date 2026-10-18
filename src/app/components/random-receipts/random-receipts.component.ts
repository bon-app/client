import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular/lazy';
import { Ingredient } from 'src/app/models/ingredient.model';
import { Receipt } from 'src/app/models/receipt.model';

@Component({
    selector: 'random-receipts',
    templateUrl: './random-receipts.component.html',
    styleUrls: ['./random-receipts.component.scss'],
    standalone: false
})
export class RandomReceiptsComponent implements OnInit {

  @Input("receipt") receipt: Receipt | Receipt[];
  @Input("receipts") receipts: Receipt[] = [];

  get receiptList(): Receipt[] {
    if (this.receipts?.length) return this.receipts;
    if (Array.isArray(this.receipt)) return this.receipt;
    return this.receipt ? [this.receipt] : [];
  }

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  goto(url: string) {
    this.navCtrl.navigateForward(url);
  }

  sliceThree(ingredients: { qta: string, ingredient: Ingredient }[]) {
    return ingredients.slice(0, 3);
  }

}
