import { Component, OnInit } from '@angular/core';
import { Receipt } from '../../models/receipt.model';
import { ReceiptsService } from '../../services/receipts.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { RimsService } from '../../services/rims.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoginComponent } from '../../components/login/login.component';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    private receiptsService: ReceiptsService,
    private route: ActivatedRoute,
    private rimsService: RimsService,
    private translate: TranslateService,
    private navCtrl: NavController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    let script = document.createElement('script');
    script.src = "assets/about/js/webflow.js";
    script.type = 'text/javascript';
    document.body.appendChild(script)
  }

}
