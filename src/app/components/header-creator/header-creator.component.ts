import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { DatasPopoverComponent } from '../datas-popover/datas-popover.component';
import { UsersPopoverComponent } from '../users-popover/users-popover.component';
import { LoginComponent } from '../login/login.component';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


@Component({
  selector: 'bonapp-header-creator',
  templateUrl: './header-creator.component.html',
  styleUrls: ['./header-creator.component.scss'],
})
export class BonAppCreatorHeaderComponent implements OnInit {

  public showPassword = false;
  public passwordToggleIcon = 'eye';
  public ShopSelected = false;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public auth: AuthService,
    private popoverCtrl: PopoverController,
    private translate: TranslateService,
    public router: Router
  ) { }

  ngOnInit() { }

  async openLoginModal(signin: boolean = false) {
    let modal = await this.modalCtrl.create({
      component: LoginComponent,
      componentProps: {
        section: signin ? 'signin' : 'login'
      },
      cssClass: ['auto-height']
    });

    modal.present();
  }

  async presentUsersPopover(ev: any) {
    
    const popover = await this.popoverCtrl.create({
      component: UsersPopoverComponent,
      event: ev,
    });
    return await popover.present();
  }


  async presentDatasPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: DatasPopoverComponent,
      event: ev,
    });
    return await popover.present();
  }

  goto(url: string) {
    if (url.startsWith("http")) {
      window.open(url, '_blank');
      return;
    }
    this.navCtrl.navigateForward(url)
  }

  logout(redirect: string) {
    Swal.fire({
      title: this.translate.instant("Alerts.logout"),
      showCancelButton: true,
      confirmButtonText: this.translate.instant("Alerts.conferma"),
      cancelButtonText: this.translate.instant("Alerts.annulla"),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.auth.logout();
        this.navCtrl.navigateRoot(redirect || '/');
      }
    })
  }

}
