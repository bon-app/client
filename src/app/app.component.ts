import { Component, Injector } from '@angular/core';

import { Platform } from '@ionic/angular/lazy';
import { Capacitor } from '@capacitor/core';
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
  constructor(
    private platform: Platform,
    translate: TranslateService,
    private injector: Injector
  ) {
    translate.setFallbackLang('en');
    translate.use(translate.getBrowserLang() || 'en');
    this.initializeApp();
    ServiceLocator.injector = injector;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isNativePlatform()) {
        void StatusBar.setStyle({ style: Style.Default });
        void SplashScreen.hide();
      }
    });
  }
}
