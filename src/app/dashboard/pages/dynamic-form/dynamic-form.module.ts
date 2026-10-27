import { TranslateCompatModule } from '../../../shared/translate-compat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { DynamicFormPageRoutingModule } from './dynamic-form-routing.module';

import { DynamicFormPage } from './dynamic-form.page';
import { FormlyModule } from '@ngx-formly/core';
import { ComponentsModule } from '../../../components/components.module';
import { DynamicFormsModule } from '../../../lib/dynamic-forms/dynamic-forms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicFormPageRoutingModule,
    ComponentsModule,
    FormlyModule,
    DynamicFormsModule,
    TranslateCompatModule
  ],
  declarations: [DynamicFormPage]
})
export class DynamicFormPageModule {}
