import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicListPage } from './dynamic-list.page';

const routes: Routes = [
  {
    path: '',
    component: DynamicListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicListPageRoutingModule {}
