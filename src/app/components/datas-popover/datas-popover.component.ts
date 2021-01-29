import { Component, Input, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { ENTITIES } from 'src/app/dashboard/pages/entities/entities.config';

@Component({
  selector: 'datas-popover',
  templateUrl: './datas-popover.component.html',
  styleUrls: ['./datas-popover.component.scss'],
})
export class DatasPopoverComponent implements OnInit {

  @Input("items") items: { label: string, url: string }[] = []

  constructor(private navCtrl: NavController, private popoverCtrl: PopoverController) { }

  ngOnInit() {
    for (let k in ENTITIES) {
      this.items.push({ label: ENTITIES[k].title, url: `/dashboard/list/${k}` })
    }
  }

  goto(url: string) {
    this.navCtrl.navigateForward(url);
    this.popoverCtrl.dismiss();
  }

}
