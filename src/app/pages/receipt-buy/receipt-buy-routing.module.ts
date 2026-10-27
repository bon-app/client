import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiptBuyPage } from './receipt-buy.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiptBuyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptBuyPageRoutingModule {}
