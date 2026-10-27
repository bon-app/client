import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuggestedProductsPage } from './suggested-products.page';

const routes: Routes = [
  {
    path: '',
    component: SuggestedProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestedProductsPageRoutingModule {}
