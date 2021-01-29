import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { Receipt } from '../../models/receipt.model';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {

  @Input("receipt") receipt: Receipt;

  constructor(public navCtrl: NavController, private receiptsService: ReceiptsService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    try {
      this.receipt = await this.receiptsService.findById(this.route.snapshot.params.id, ['-__v'], ['ingredients.ingredient'])
    } catch (error) {

    }
  }

  getIngredientName(ingredient) {
    return typeof ingredient != 'string' ? ingredient.name : ingredient;
  }

}
