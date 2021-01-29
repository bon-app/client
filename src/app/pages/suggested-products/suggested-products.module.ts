import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestedProductsPageRoutingModule } from './suggested-products-routing.module';

import { SuggestedProductsPage } from './suggested-products.page';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestedProductsPageRoutingModule,
    ComponentsModule,
    TranslateModule.forChild()
  ],
  declarations: [SuggestedProductsPage]
})
export class SuggestedProductsPageModule {}
