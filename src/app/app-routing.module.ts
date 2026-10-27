import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookbookPage } from './pages/cookbook/cookbook.page';
import { AuthService } from './auth/auth.service';
import { inject } from '@angular/core';
const page = () => import('./pages/cookbook/cookbook.page').then(m => m.CookbookPage);
const leave = (component: CookbookPage) => component.canLeave();
const admin = () => inject(AuthService).hasRoles(['admin']);
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', loadComponent: page, data: { mode: 'discover' } },
  { path: 'receipts', loadComponent: page, data: { mode: 'discover' } },
  { path: 'app/feed', loadComponent: page, data: { mode: 'feed' } },
  { path: 'discover', redirectTo: 'receipts', pathMatch: 'full' },
  { path: 'cookbook', loadComponent: page, data: { mode: 'cookbook' } },
  { path: 'app/capture', loadComponent: () => import('./pages/capture/capture.page').then(m => m.CapturePage) },
  { path: 'app/settings', loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage) },
  { path: 'new', loadComponent: page, data: { mode: 'editor' }, canDeactivate: [leave] },
  { path: 'edit/:id', loadComponent: page, data: { mode: 'editor' }, canDeactivate: [leave] },
  { path: 'receipt/:id/buy', loadComponent: page, data: { mode: 'retired' } },
  { path: 'receipt/:id', loadComponent: page, data: { mode: 'detail' } },
  { path: 'profile', loadComponent: page, data: { mode: 'profile' }, canDeactivate: [leave] },
  { path: 'about', loadComponent: page, data: { mode: 'about' } },
  { path: 'shop', loadComponent: page, data: { mode: 'retired' } },
  { path: 'checkout', loadComponent: page, data: { mode: 'retired' } },
  { path: 'suggested-products', loadComponent: page, data: { mode: 'retired' } },
  { path: 'orders', canActivate: [admin], loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule) },
  { path: 'orders/:id', canActivate: [admin], loadChildren: () => import('./pages/order-confirm/order-confirm.module').then(m => m.OrderConfirmPageModule) },
  { path: 'order-confirm/:id', canActivate: [admin], loadChildren: () => import('./pages/order-confirm/order-confirm.module').then(m => m.OrderConfirmPageModule) },
  { path: 'today-orders', canActivate: [admin], loadChildren: () => import('./pages/today-orders/today-orders.module').then(m => m.TodayOrdersPageModule) },
  { path: 'dashboard/data/receiptsForCreator/:id', redirectTo: 'edit/:id' },
  { path: 'dashboard/data/receiptsForCreator', redirectTo: 'new', pathMatch: 'full' },
  { path: 'dashboard/data/receipts/:id', redirectTo: 'edit/:id' },
  { path: 'dashboard/data/receipts', redirectTo: 'new', pathMatch: 'full' },
  { path: 'dashboard/list/receiptsForCreator', redirectTo: 'cookbook', pathMatch: 'full' },
  { path: 'dashboard/data/:entity/:id', canActivate: [admin], loadChildren: () => import('./dashboard/pages/dynamic-form/dynamic-form.module').then(m => m.DynamicFormPageModule) },
  { path: 'dashboard/data/:entity', canActivate: [admin], loadChildren: () => import('./dashboard/pages/dynamic-form/dynamic-form.module').then(m => m.DynamicFormPageModule) },
  { path: 'dashboard/list/:entity', canActivate: [admin], loadChildren: () => import('./dashboard/pages/dynamic-list/dynamic-list.module').then(m => m.DynamicListPageModule) },
  { path: ':username', loadComponent: page, data: { mode: 'creator' } },
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
