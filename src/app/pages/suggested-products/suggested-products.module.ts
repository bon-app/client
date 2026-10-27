import { TranslateCompatModule } from '../../shared/translate-compat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { SuggestedProductsPageRoutingModule } from './suggested-products-routing.module';

import { SuggestedProductsPage } from './suggested-products.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestedProductsPageRoutingModule,
    ComponentsModule,
    TranslateCompatModule
  ],
  declarations: [SuggestedProductsPage]
})
export class SuggestedProductsPageModule {}
