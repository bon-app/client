import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular/lazy';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { TokenInterceptor } from './auth/interceptors/token.interceptor';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';
import { DFIngredientsPriorityComponent } from './components/dynamics-form-custom/ingredients-priority/ingredients-priority.component';
import { DFIngredientsComponent } from './components/dynamics-form-custom/df-ingredients/df-ingredients.component';
import { IngredientsQtaComponent } from './components/dynamics-form-custom/ingredients-qta/ingredients-qta.component';
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
import { DynamicFormsModule } from './lib/dynamic-forms/dynamic-forms.module';
import { PreparingFormComponent } from './components/dynamics-form-custom/preparing-form/preparing-form.component';
import { FormlyIonicCheckboxType, FormlyIonicInputType, FormlyIonicSelectType } from './lib/dynamic-forms/components/formly-ionic-types';

@NgModule({ declarations: [AppComponent, FormlyIonicInputType, FormlyIonicCheckboxType, FormlyIonicSelectType],
    bootstrap: [AppComponent], imports: [BrowserModule,
        IonicModule.forRoot({ mode: 'ios' }),
        AppRoutingModule,
        ComponentsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot({
            types: [
                { name: 'input', component: FormlyIonicInputType },
                { name: 'checkbox', component: FormlyIonicCheckboxType },
                { name: 'select', component: FormlyIonicSelectType },
                {
                    name: 'ingredients-priority',
                    component: DFIngredientsPriorityComponent,
                },
                { name: 'ingredients', component: DFIngredientsComponent },
                { name: 'ingredients-qta', component: IngredientsQtaComponent },
                { name: 'preparing', component: PreparingFormComponent },
            ],
        }),
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
                { entity: User },
            ],
            entitiesService: [
                { service: IngredientsService },
                { service: CategoriesService },
                { service: ReceiptsService },
                { service: RimsService },
                { service: UsersService },
                { service: OrdersService },
                { service: ImagesService },
                { service: UsersService },
            ],
        })], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
        provideTranslateService({ fallbackLang: 'en', lang: 'en', loader: TranslateHttpLoader }),
        ...provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    ] })
export class AppModule {}
