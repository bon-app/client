import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public user: User = new User();
  public c_password: string;
  public section: 'login' | 'signin' = 'login';

  constructor(
    private usersService: UsersService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  async login() {
    try {
      await this.usersService.login(this.user);
      this.modalCtrl.dismiss();
    } catch (error) {
      let toast = await this.toastCtrl.create({ message: this.translate.instant('Errors.' + error.error.code), duration: 3000 });
      toast.present();
    }
  }

  async signIn() {
    try {
      await this.usersService.signIn(this.user);
      this.modalCtrl.dismiss();
    } catch (error) {
      let toast = await this.toastCtrl.create({ message: this.translate.instant('Errors.' + error.error.code), duration: 3000 });
      toast.present();
    }
  }

}
