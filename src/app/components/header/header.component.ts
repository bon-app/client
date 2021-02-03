import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { DatasPopoverComponent } from '../datas-popover/datas-popover.component';
import { LoginComponent } from '../login/login.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'bonapp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class BonAppHeaderComponent implements OnInit {

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public auth: AuthService,
    private popoverCtrl: PopoverController
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

  async presentDatasPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: DatasPopoverComponent,
      event: ev,
    });
    return await popover.present();
  }

  goto(url: string) {
    this.navCtrl.navigateForward(url)
  }

  logout(redirect: string) {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.auth.logout();
        this.navCtrl.navigateRoot(redirect || '/');
      }
    })


   
  }

}
