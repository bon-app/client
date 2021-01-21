import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderConfirmPageRoutingModule } from './order-confirm-routing.module';

import { OrderConfirmPage } from './order-confirm.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ComponentsModule,
    OrderConfirmPageRoutingModule
  ],
  declarations: [OrderConfirmPage]
})
export class OrderConfirmPageModule {}
