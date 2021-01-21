import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { OrdersPageRoutingModule } from './orders-routing.module';
import { OrdersPage } from './orders.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule,
    NgxQRCodeModule
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
