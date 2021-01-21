import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Receipt } from 'src/app/models/receipt.model';

@Component({
  selector: 'random-receipts',
  templateUrl: './random-receipts.component.html',
  styleUrls: ['./random-receipts.component.scss'],
})
export class RandomReceiptsComponent implements OnInit {

  @Input("receipts") receipts: Receipt[] = []

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  goto(url: string) {
    this.navCtrl.navigateForward(url);
  }

}
