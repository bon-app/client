import { NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController,
} from '@ionic/angular/lazy';
import { of } from 'rxjs';
import { provideTranslateService } from '@ngx-translate/core';

const controller = {
  create: async () => ({
    present: async () => undefined,
    dismiss: async () => undefined,
    onDidDismiss: async () => ({ data: undefined, role: undefined }),
  }),
  dismiss: async () => true,
  getTop: async () => undefined,
};

@NgModule({
  providers: [
    ...provideTranslateService(),
    { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {}, paramMap: { get: () => null } }, params: of({}), queryParams: of({}) } },
    { provide: Router, useValue: { navigate: async () => true, navigateByUrl: async () => true, url: '/' } },
    { provide: NavController, useValue: { navigateForward: async () => true, navigateBack: async () => true, back: () => undefined, setDirection: () => undefined } },
    { provide: Platform, useValue: { ready: async () => undefined, is: () => false, width: () => 1024, height: () => 768 } },
    { provide: ActionSheetController, useValue: controller },
    { provide: AlertController, useValue: controller },
    { provide: LoadingController, useValue: controller },
    { provide: ModalController, useValue: controller },
    { provide: PopoverController, useValue: controller },
    { provide: ToastController, useValue: controller },
  ],
})
export class TestIonicModule {}
