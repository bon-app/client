import { Component, Injector, NgZone } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular/lazy';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './components/login/login.component';
import { App } from '@capacitor/app';
import { CaptureDraftService } from './pages/capture/capture-draft.service';
import { imageData } from './pages/cookbook/recipe-editor';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { ServiceLocator } from './services/service-locator';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false
})
export class AppComponent {
  android = Capacitor.getPlatform() === 'android';
  keyboardOpen = false;
  private initialPath = window.location.pathname;
  constructor(
    private platform: Platform,
    translate: TranslateService,
    private injector: Injector,
    private router: Router,
    private auth: AuthService,
    private modal: ModalController,
    private drafts: CaptureDraftService,
    private zone: NgZone
  ) {
    translate.setFallbackLang('en');
    const savedLanguage = localStorage.getItem('bonapp.language');
    translate.use(['it', 'en'].includes(savedLanguage || '') ? savedLanguage! : ['it', 'en'].includes(translate.getBrowserLang() || '') ? translate.getBrowserLang()! : 'en');
    this.initializeApp();
    ServiceLocator.injector = injector;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isNativePlatform()) {
        void StatusBar.setStyle({ style: Style.Default });
        void SplashScreen.hide();
      }
      if (this.android) {
        void Keyboard.addListener('keyboardWillShow', () => this.zone.run(() => this.keyboardOpen = true));
        void Keyboard.addListener('keyboardWillHide', () => this.zone.run(() => this.keyboardOpen = false));
        void App.addListener('appRestoredResult', async result => {
          if (result.pluginId !== 'Camera' || result.methodName !== 'getPhoto' || !result.success || !result.data?.dataUrl || !this.auth.isAuthenticate()) return;
          try {
            const blob = await (await fetch(result.data.dataUrl)).blob();
            const draft = this.drafts.get();
            draft.photo = await imageData(new File([blob], 'recipe.jpg', { type: blob.type || 'image/jpeg' }));
            if (draft.keep === undefined) draft.keep = localStorage.getItem('bonapp.keepRecording') === 'true';
            this.drafts.set(draft);
            await this.router.navigateByUrl('/app/capture');
          } catch { /* The capture page still offers camera and gallery. */ }
        });
        if (this.initialPath === '/' && (this.router.url === '/' || this.router.url === '/home')) void this.router.navigateByUrl('/cookbook');
      }
    });
  }
  async startCapture() {
    if (!this.auth.isAuthenticate()) {
      const modal = await this.modal.create({ component: LoginComponent, componentProps: { section: 'login' }, cssClass: ['auto-height'] });
      await modal.present();
      await modal.onDidDismiss();
    }
    if (this.auth.isAuthenticate()) await this.router.navigate(['/app/capture'], { queryParams: { open: '1', nonce: Date.now() } });
  }
}
