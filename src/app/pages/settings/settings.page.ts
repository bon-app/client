import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';
import { TranslateService } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { AuthService } from '../../auth/auth.service';
import { Capacitor } from '@capacitor/core';
import { RecipeRecorder } from '../capture/capture-draft.service';

@Component({ selector: 'app-settings', standalone: true, imports: [CommonModule, FormsModule, RouterModule, IonicModule, ComponentsModule], templateUrl: './settings.page.html', styleUrls: ['./settings.page.scss'] })
export class SettingsPage {
  language: string;
  keepDefault = localStorage.getItem('bonapp.keepRecording') === 'true';
  constructor(public auth: AuthService, private translate: TranslateService, private router: Router) { this.language = translate.getCurrentLang() || 'en'; }
  t(key: string) { return this.translate.instant('Capture.' + key); }
  setLanguage(language: string) { this.language = language; localStorage.setItem('bonapp.language', language); this.translate.use(language); }
  setKeep(value: boolean) { this.keepDefault = value; localStorage.setItem('bonapp.keepRecording', String(value)); }
  async signOut() { if (Capacitor.getPlatform() === 'android') await RecipeRecorder.stop().catch(() => {}); this.auth.logout(); await this.router.navigate(['/cookbook']); }
}
