import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseIngredientsComponent } from './choose-ingredients/choose-ingredients.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RandomReceiptsComponent } from './random-receipts/random-receipts.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductCardMobileComponent } from './product-card-mobile/product-card-mobile.component';
import { BonAppHeaderComponent } from './header/header.component';
import { BonAppCreatorHeaderComponent } from './header-creator/header-creator.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { FooterCartComponent } from './footer-cart/footer-cart.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { IngredientsPriorityComponent } from './ingredients-priority/ingredients-priority.component';
import { IngredientsReceiptsComponent } from './ingredients-receipts/ingredients-receipts.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { FormlyModule } from '@ngx-formly/core';
import { DFIngredientsPriorityComponent } from './dynamics-form-custom/ingredients-priority/ingredients-priority.component';
import { JoditAngularModule } from 'jodit-angular';
import { DatasPopoverComponent } from './datas-popover/datas-popover.component';
import { UsersPopoverComponent } from './users-popover/users-popover.component';
import { IngredientsQtaComponent } from './dynamics-form-custom/ingredients-qta/ingredients-qta.component';
import { DFIngredientsComponent } from './dynamics-form-custom/df-ingredients/df-ingredients.component';
import { PreparingFormComponent } from './dynamics-form-custom/preparing-form/preparing-form.component';

const components = [
  ChooseIngredientsComponent, RandomReceiptsComponent, ProductCardComponent, ProductCardMobileComponent, BonAppHeaderComponent, BonAppCreatorHeaderComponent,
  LoginComponent, FooterCartComponent, CartDetailsComponent, AddressFormComponent,
  IngredientsPriorityComponent, IngredientsReceiptsComponent, IngredientsComponent,
  DFIngredientsPriorityComponent, DatasPopoverComponent, UsersPopoverComponent, IngredientsQtaComponent, DFIngredientsComponent,
  PreparingFormComponent
];

@NgModule({
  declarations: components,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    AutoCompleteModule,
    FormlyModule,
    TranslateModule.forChild(),
    JoditAngularModule
  ],
  exports: components
})
export class ComponentsModule { }
