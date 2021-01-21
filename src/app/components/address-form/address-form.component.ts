import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit {

  public address: { street?: string, street_number?: string, city?: string, prov?: string, state?: string, note?: string, [key: string]: any } = { state: 'Italia' }

  constructor(private auth: AuthService, private modalCtrl: ModalController) { }

  ngOnInit() {}

  save() {
    let identity = this.auth.getIdentity()
    identity.addresses = identity.addresses || [];
    identity.addresses.push(this.address);
    this.modalCtrl.dismiss();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

}
