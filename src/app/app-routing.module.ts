import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  // {
  //   path: ':username',
  //   loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  // },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'shop',
    loadChildren: () => import('./pages/receipt-buy/receipt-buy.module').then(m => m.ReceiptBuyPageModule)
  },
  {
    path: 'receipt/:id',
    loadChildren: () => import('./pages/receipt/receipt.module').then(m => m.ReceiptPageModule)
  },
  {
    path: 'receipt/:id/buy',
    loadChildren: () => import('./pages/receipt-buy/receipt-buy.module').then(m => m.ReceiptBuyPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule)
  },
  {
    path: 'order-confirm/:id',
    loadChildren: () => import('./pages/order-confirm/order-confirm.module').then(m => m.OrderConfirmPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'orders/:id',
    loadChildren: () => import('./pages/order-confirm/order-confirm.module').then(m => m.OrderConfirmPageModule)
  },
  {
    path: 'receipts',
    loadChildren: () => import('./pages/receipt-list/receipt-list.module').then(m => m.ReceiptListPageModule)
  },
  {
    path: 'dashboard/data/:entity',
    loadChildren: () => import('./dashboard/pages/dynamic-form/dynamic-form.module').then(m => m.DynamicFormPageModule)
  },
  {
    path: 'dashboard/data/:entity/:id',
    loadChildren: () => import('./dashboard/pages/dynamic-form/dynamic-form.module').then(m => m.DynamicFormPageModule)
  },
  {
    path: 'dashboard/list/:entity',
    loadChildren: () => import('./dashboard/pages/dynamic-list/dynamic-list.module').then(m => m.DynamicListPageModule)
  },
  {
    path: 'suggested-products',
    loadChildren: () => import('./pages/suggested-products/suggested-products.module').then(m => m.SuggestedProductsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'today-orders',
    loadChildren: () => import('./pages/today-orders/today-orders.module').then(m => m.TodayOrdersPageModule)
  },
  {
    path: ':username',
    loadChildren: () => import('./pages/creator/creator.module').then( m => m.CreatorPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
