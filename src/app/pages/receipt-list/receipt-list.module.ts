import { TranslateCompatModule } from '../../shared/translate-compat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ReceiptListPageRoutingModule } from './receipt-list-routing.module';

import { ReceiptListPage } from './receipt-list.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptListPageRoutingModule,
    TranslateCompatModule,
    ComponentsModule
  ],
  declarations: [ReceiptListPage]
})
export class ReceiptListPageModule {}
