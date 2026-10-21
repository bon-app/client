import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { ModalController, ToastController } from '@ionic/angular/lazy';
import { TranslateService } from '@ngx-translate/core';
//import { ShowHidePasswordComponent } from './show-hide-password.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {
  public user: User = new User();
  public c_password: string;
  public section: 'login' | 'signin' = 'login';
  public showPassword = false;
  public busy = false;
  public error = '';
  close() { this.modalCtrl.dismiss(); }
  public passwordToggleIcon = 'eye-outline';

  constructor(
    private usersService: UsersService,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  async login() {
    if(this.busy) return; this.busy = true; this.error = '';
    try {
      await this.usersService.login(this.user);
      this.modalCtrl.dismiss();
    } catch (error) {
      this.errorToast(error);
    } finally { this.busy = false; }
  }

  async signIn() {
    if(this.busy) return; this.busy = true; this.error = '';
    try {
      this.user.nickname = this.user.nickname.toLowerCase();
      await this.usersService.signIn(this.user);
      this.modalCtrl.dismiss();
    } catch (error) {
      this.errorToast(error);
    } finally { this.busy = false; }
  }

  async errorToast(error) {
    const key = 'Cookbook.errors.' + error?.error?.code;
    const message = this.translate.instant(key);
    this.error = message === key ? this.translate.instant('Cookbook.failed') : message;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.showPassword == true) {
      this.passwordToggleIcon = 'eye-off-outline';
    } else {
      this.passwordToggleIcon = 'eye-outline';
    }
  }
}
