import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiptListPageRoutingModule } from './receipt-list-routing.module';

import { ReceiptListPage } from './receipt-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptListPageRoutingModule,
    TranslateModule.forChild(),
    ComponentsModule
  ],
  declarations: [ReceiptListPage]
})
export class ReceiptListPageModule {}
