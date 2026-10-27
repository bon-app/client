import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular/lazy';

@Component({
    selector: 'bonapp-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    standalone: false
})
export class BonAppPageNotFoundComponent implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  goto(url: string) { this.navCtrl.navigateForward(url); }
}
