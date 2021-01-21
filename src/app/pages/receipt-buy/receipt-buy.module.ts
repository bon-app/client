import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiptBuyPageRoutingModule } from './receipt-buy-routing.module';

import { ReceiptBuyPage } from './receipt-buy.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptBuyPageRoutingModule,
    ComponentsModule,
    TranslateModule.forChild()
  ],
  declarations: [ReceiptBuyPage]
})
export class ReceiptBuyPageModule {}
