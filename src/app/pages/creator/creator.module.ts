import { TranslateCompatModule } from '../../shared/translate-compat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';

import { CreatorPageRoutingModule } from './creator-routing.module';

import { CreatorPage } from './creator.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorPageRoutingModule,    
    TranslateCompatModule,
    ComponentsModule
  ],
  declarations: [CreatorPage]
})
export class CreatorPageModule {}
