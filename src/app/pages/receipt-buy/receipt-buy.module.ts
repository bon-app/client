import { TranslateCompatModule } from '../../shared/translate-compat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ReceiptBuyPageRoutingModule } from './receipt-buy-routing.module';

import { ReceiptBuyPage } from './receipt-buy.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptBuyPageRoutingModule,
    ComponentsModule,
    TranslateCompatModule
  ],
  declarations: [ReceiptBuyPage]
})
export class ReceiptBuyPageModule {}
