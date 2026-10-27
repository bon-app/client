import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodayOrdersPage } from './today-orders.page';

const routes: Routes = [
  {
    path: '',
    component: TodayOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodayOrdersPageRoutingModule {}
