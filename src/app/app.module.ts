import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { ComponentsModule } from './components/components.module';
import { DFIngredientsPriorityComponent } from './components/dynamics-form-custom/ingredients-priority/ingredients-priority.component';
import { DFIngredientsComponent } from './components/dynamics-form-custom/df-ingredients/df-ingredients.component';
import { IngredientsQtaComponent } from './components/dynamics-form-custom/ingredients-qta/ingredients-qta.component';
import { JoditAngularModule } from 'jodit-angular';
import { DynamicFormsModule } from './lib/dynamic-forms';
import { ENTITIES } from './dashboard/pages/entities/entities.config';
import { ReceiptIngredientsMatching } from './models/receipt-ingredientsMatching.model';
import { Ingredient } from './models/ingredient.model';
import { Category } from './models/category.model';
import { Receipt } from './models/receipt.model';
import { IngredientsService } from './services/ingredients.service';
import { CategoriesService } from './services/categories.service';
import { ReceiptsService } from './services/receipts.service';
import { RimsService } from './services/rims.service';
import { User } from './models/user.model';
import { Order } from './models/order.model';
import { UsersService } from './services/users.service';
import { OrdersService } from './services/orders.service';
import { BAImage } from './models/image.model';
import { ImagesService } from './services/images.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    FormlyModule.forRoot(
      {
        types: [
          { name: 'ingredients-priority', component: DFIngredientsPriorityComponent },
          { name: 'ingredients', component: DFIngredientsComponent },
          { name: 'ingredients-qta', component: IngredientsQtaComponent },
        ]
      }
    ),
    FormlyIonicModule,
    JoditAngularModule,
    DynamicFormsModule.forRoot({
      entitiesConfig: [
        { key: 'ingredients', config: ENTITIES.ingredients },
        { key: 'categories', config: ENTITIES.categories },
        { key: 'receipts', config: ENTITIES.receipts },
        { key: 'rims', config: ENTITIES.rims },
        { key: 'orders', config: ENTITIES.orders },
        { key: 'images', config: ENTITIES.images },
      ],
      entities: [
        { entity: Ingredient },
        { entity: Category },
        { entity: Receipt },
        { entity: ReceiptIngredientsMatching },
        { entity: User },
        { entity: Order },
        { entity: BAImage },
      ],
      entitiesService: [
        { service: IngredientsService },
        { service: CategoriesService },
        { service: ReceiptsService },
        { service: RimsService },
        { service: UsersService },
        { service: OrdersService },
        { service: ImagesService },
      ]
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
