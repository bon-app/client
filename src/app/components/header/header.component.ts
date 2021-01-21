import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'bonapp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class BonAppHeaderComponent implements OnInit {

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, public auth: AuthService) { }

  ngOnInit() { }

  async openLoginModal(signin: boolean = false) {
    let modal = await this.modalCtrl.create({
      component: LoginComponent,
      componentProps: {
        section: signin? 'signin' : 'login'
      },
      cssClass: ['auto-height']
    });

    modal.present();
  }

  goto(url: string) {
    this.navCtrl.navigateForward(url)
  }

}
