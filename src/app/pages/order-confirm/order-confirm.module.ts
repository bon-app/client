import { TranslateCompatModule } from '../../shared/translate-compat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';

import { OrderConfirmPageRoutingModule } from './order-confirm-routing.module';

import { OrderConfirmPage } from './order-confirm.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateCompatModule,
    ComponentsModule,
    OrderConfirmPageRoutingModule
  ],
  declarations: [OrderConfirmPage]
})
export class OrderConfirmPageModule {}
