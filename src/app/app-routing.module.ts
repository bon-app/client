import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'receipt/:id',
    loadChildren: () => import('./pages/receipt/receipt.module').then( m => m.ReceiptPageModule)
  },
  {
    path: 'receipt/:id/buy',
    loadChildren: () => import('./pages/receipt-buy/receipt-buy.module').then( m => m.ReceiptBuyPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'order-confirm/:id',
    loadChildren: () => import('./pages/order-confirm/order-confirm.module').then( m => m.OrderConfirmPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'orders/:id',
    loadChildren: () => import('./pages/order-confirm/order-confirm.module').then( m => m.OrderConfirmPageModule)
  },
  {
    path: 'receipts',
    loadChildren: () => import('./pages/receipt-list/receipt-list.module').then( m => m.ReceiptListPageModule)
  },
  {
    path: 'data',
    loadChildren: () => import('./dashboard/pages/data/data.module').then( m => m.DataPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
