import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodayOrdersPageRoutingModule } from './today-orders-routing.module';

import { TodayOrdersPage } from './today-orders.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayOrdersPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TodayOrdersPage]
})
export class TodayOrdersPageModule {}
