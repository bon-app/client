import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DynamicListPageRoutingModule } from './dynamic-list-routing.module';

import { DynamicListPage } from './dynamic-list.page';
import { ComponentsModule } from '../../../components/components.module';
import { DynamicFormsModule } from '../../../lib/dynamic-forms/dynamic-forms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicListPageRoutingModule,
    DynamicFormsModule,
    ComponentsModule
  ],
  declarations: [DynamicListPage]
})
export class DynamicListPageModule { }
