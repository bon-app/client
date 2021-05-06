import { Component, Input, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { ENTITIES } from 'src/app/dashboard/pages/entities/entities.config';
import Swal from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'users-popover',
  templateUrl: './users-popover.component.html',
  styleUrls: ['./users-popover.component.scss'],
})
export class UsersPopoverComponent implements OnInit {

  // @Input("items") items: { label: string, url: string }[] = []

  constructor(
    private navCtrl: NavController,   
    private popoverCtrl: PopoverController, 
    private translate: TranslateService,
    private auth: AuthService
    ) 
    { }

  ngOnInit() {
    // for (let k in ENTITIES) {
    //   if ((k == 'receipts' && this.auth.hasRoles(['creator'])) || this.auth.hasRoles(['admin'])) {
    //     this.items.push({ label: ENTITIES[k].title, url: `/dashboard/list/${k}` })
    //   }
    // }
  }


  goto(url: string) {
    if (url.startsWith("http")) {
      window.open(url, '_blank');
      return;
    }
    this.navCtrl.navigateForward(url);
    this.popoverCtrl.dismiss();
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
        this.popoverCtrl.dismiss();
      }
    })
  }

}
