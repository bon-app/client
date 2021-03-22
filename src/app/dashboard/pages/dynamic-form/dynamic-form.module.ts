import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DynamicFormPageRoutingModule } from './dynamic-form-routing.module';

import { DynamicFormPage } from './dynamic-form.page';
import { FormlyModule } from '@ngx-formly/core';
import { ComponentsModule } from '../../../components/components.module';
import { DynamicFormsModule } from '../../../lib/dynamic-forms/dynamic-forms.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicFormPageRoutingModule,
    ComponentsModule,
    FormlyModule,
    DynamicFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [DynamicFormPage]
})
export class DynamicFormPageModule {}
