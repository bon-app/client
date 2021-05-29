import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodayOrdersPageRoutingModule } from './today-orders-routing.module';

import { TodayOrdersPage } from './today-orders.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayOrdersPageRoutingModule,
    ComponentsModule,
    TranslateModule
  ],
  declarations: [TodayOrdersPage]
})
export class TodayOrdersPageModule {}
