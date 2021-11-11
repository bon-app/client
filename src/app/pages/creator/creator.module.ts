import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CreatorPageRoutingModule } from './creator-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'ionic4-auto-complete';

import { CreatorPage } from './creator.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorPageRoutingModule,    
    TranslateModule.forChild(),
    AutoCompleteModule,
    ComponentsModule
  ],
  declarations: [CreatorPage]
})
export class CreatorPageModule {}
