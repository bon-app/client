import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ActionSheetController, IonicModule } from '@ionic/angular/lazy';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ComponentsModule } from '../../components/components.module';
import { Global } from '../../services/global';
import { imageData } from '../cookbook/recipe-editor';
import { CaptureDraft, CaptureDraftService, RecipeRecorder, RecordingStatus } from './capture-draft.service';

@Component({ selector: 'app-capture', standalone: true, imports: [CommonModule, FormsModule, RouterModule, IonicModule, ComponentsModule], templateUrl: './capture.page.html', styleUrls: ['./capture.page.scss'] })
export class CapturePage implements OnInit, OnDestroy {
  draft: CaptureDraft = {};
  status: RecordingStatus = { state: 'idle', duration: 0 };
  loading = false; error = ''; playback = ''; notice = '';
  private timer?: ReturnType<typeof setInterval>; private polling = false; private lastPoll = 0; private routeSub?: Subscription;
  private alive = true;
  constructor(public auth: AuthService, private drafts: CaptureDraftService, private http: HttpClient, private router: Router,
              private route: ActivatedRoute, private sheet: ActionSheetController, private translate: TranslateService) {}
  t(key: string) { return this.translate.instant('Capture.' + key); }
  get android() { return Capacitor.getPlatform() === 'android'; }
  get active() { return this.status.state === 'recording' || this.status.state === 'paused' || this.status.state === 'starting'; }
  get pendingResult() { return !!this.draft.captureId && (['queued', 'processing'].includes(this.draft.status || '') || this.draft.status === 'completed' && !this.draft.result); }
  get time() { const seconds = Math.floor((this.status.duration || 0) / 1000); return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
  ngOnInit() {
    this.draft = this.drafts.get();
    this.routeSub = this.route.queryParamMap.subscribe(params => { if (params.get('open') === '1' && this.android && this.auth.isAuthenticate()) void this.begin(); });
    this.timer = setInterval(() => { void this.refreshStatus(); if (this.pendingResult) void this.poll(); }, 1000);
    void this.refreshStatus();
    if (this.pendingResult) void this.poll();
  }
  ionViewWillEnter() { this.draft = this.drafts.get(); void this.refreshStatus(); if (this.pendingResult) void this.poll(); }
  ngOnDestroy() { this.alive = false; this.routeSub?.unsubscribe(); if (this.timer) clearInterval(this.timer); }
  persist() { try { this.drafts.set(this.draft); } catch { this.error = this.t('storageError'); } }
  async begin() {
    if (this.loading) { this.notice = this.t('uploading'); return; }
    this.draft = this.drafts.get();
    await this.refreshStatus();
    if (this.active || this.draft.photo || this.draft.captureId || this.draft.recipe) {
      const sheet = await this.sheet.create({ header: this.t('draftFound'), buttons: [
        { text: this.t('resumeDraft'), handler: () => {} },
        { text: this.t('discardNew'), role: 'destructive', handler: () => { void this.discardAndOpen(); } },
        { text: this.t('cancel'), role: 'cancel' }
      ] });
      await sheet.present(); return;
    }
    await this.photo(CameraSource.Camera);
  }
  async discardAndOpen() {
    if (this.active) await RecipeRecorder.stop();
    try { await RecipeRecorder.discard(); } catch { /* no recording */ }
    if (this.draft.captureId) { try { await firstValueFrom(this.http.delete(`${Global.ENDPOINTS.BASE}recipe-captures/${this.draft.captureId}`)); } catch { /* server expires abandoned captures */ } }
    this.drafts.clear(); this.draft = {}; this.playback = ''; await this.photo(CameraSource.Camera);
  }
  async photo(source: CameraSource = CameraSource.Camera) {
    if (!this.android) return;
    this.error = '';
    try {
      const result = await Camera.getPhoto({ quality: 85, resultType: CameraResultType.DataUrl, source, correctOrientation: true });
      if (!result.dataUrl) return;
      const blob = await (await fetch(result.dataUrl)).blob();
      this.draft.photo = await imageData(new File([blob], 'recipe.jpg', { type: blob.type || 'image/jpeg' }));
      if (this.draft.keep === undefined) this.draft.keep = localStorage.getItem('bonapp.keepRecording') === 'true';
      this.persist();
    } catch (e: any) { if (!/cancel/i.test(String(e?.message || e))) this.error = this.t('photoError'); }
  }
  gallery() { void this.photo(CameraSource.Photos); }
  async refreshStatus() {
    if (!this.android) return;
    try {
      const previous = this.status.state;
      this.status = await RecipeRecorder.status();
      if (this.status.state === 'stopped' && previous !== 'stopped') await this.loadAudio();
      if (this.status.state === 'idle') this.playback = '';
      if (this.status.state === 'interrupted' || this.status.state === 'error') this.error = this.t('recordingError');
    } catch { this.error = this.t('recordingError'); }
  }
  async record() {
    if (!this.android || this.active || this.loading) return;
    if (this.status.state === 'stopped' && !window.confirm(this.t('replaceRecording'))) return;
    this.error = ''; this.playback = '';
    try {
      if (this.draft.captureId) {
        try { await firstValueFrom(this.http.delete(`${Global.ENDPOINTS.BASE}recipe-captures/${this.draft.captureId}`)); } catch { /* server expires abandoned captures */ }
        delete this.draft.captureId; delete this.draft.status; delete this.draft.result; this.persist();
      }
      await RecipeRecorder.discard(); this.status = { state: 'starting', duration: 0 };
      await RecipeRecorder.start({ language: this.translate.getCurrentLang() || 'en' });
    } catch { this.status = { state: 'idle', duration: 0 }; this.error = this.t('microphoneError'); }
  }
  async pause() { try { await RecipeRecorder.pause(); await this.refreshStatus(); } catch { this.error = this.t('recordingError'); } }
  async resume() { try { await RecipeRecorder.resume(); await this.refreshStatus(); } catch { this.error = this.t('recordingError'); } }
  async stop() { try { await RecipeRecorder.stop(); await this.refreshStatus(); } catch { this.error = this.t('recordingError'); } }
  async loadAudio() { try { this.playback = Capacitor.convertFileSrc((await RecipeRecorder.read()).path); } catch { this.error = this.t('recordingError'); } }
  private async uploadRecording() {
    if (this.draft.captureId && ['uploaded', 'failed', 'completed'].includes(this.draft.status || '')) {
      try { await firstValueFrom(this.http.get(`${Global.ENDPOINTS.BASE}recipe-captures/${this.draft.captureId}`)); return this.draft.captureId; }
      catch (error: any) { if (error?.status !== 404) throw error; delete this.draft.captureId; delete this.draft.status; this.persist(); }
    }
    const audio = await RecipeRecorder.read();
    const local = await fetch(Capacitor.convertFileSrc(audio.path));
    if (!local.ok) throw new Error('local');
    const blob = await local.blob();
    if (!blob.size || blob.size > 5 * 1024 * 1024) throw new Error('large');
    const created = await firstValueFrom(this.http.post<any>(`${Global.ENDPOINTS.BASE}recipe-captures`, { language: this.draft.language || 'auto' }));
    this.draft.captureId = created.id; this.draft.status = 'awaiting_upload'; this.persist();
    const form = new FormData(); for (const [key, value] of Object.entries(created.upload.fields)) form.append(key, String(value));
    form.append('file', new Blob([blob], { type: 'audio/mp4' }), 'recipe.m4a');
    const upload = await fetch(created.upload.url, { method: 'POST', body: form });
    if (!upload.ok) throw new Error('upload');
    this.draft.status = 'uploaded'; this.persist();
    return created.id as string;
  }
  async generate() {
    if (this.loading || this.active || !this.playback) return;
    this.error = ''; this.loading = true;
    try {
      const captureId = await this.uploadRecording();
      const job = await firstValueFrom(this.http.post<any>(`${Global.ENDPOINTS.BASE}recipe-captures/${captureId}/generate`, { language: this.draft.language || 'auto' }));
      this.draft.status = job.status; this.persist();
      await this.poll();
    } catch { this.error = this.t('generateError'); } finally { this.loading = false; }
  }
  async retry() {
    if (this.draft.captureId && ['uploaded', 'failed'].includes(this.draft.status || '')) {
      this.loading = true; this.error = '';
      try { const job = await firstValueFrom(this.http.post<any>(`${Global.ENDPOINTS.BASE}recipe-captures/${this.draft.captureId}/generate`, { language: this.draft.language || 'auto' })); this.draft.status = job.status; this.persist(); this.lastPoll = 0; await this.poll(); }
      catch (error: any) { if (error?.status === 404) { delete this.draft.captureId; this.persist(); } this.error = this.t('generateError'); } finally { this.loading = false; }
    } else await this.generate();
  }
  async poll() {
    if (this.polling || !this.draft.captureId || Date.now() - this.lastPoll < 3000) return;
    const captureId = this.draft.captureId;
    this.polling = true; this.lastPoll = Date.now();
    try {
      const job = await firstValueFrom(this.http.get<any>(`${Global.ENDPOINTS.BASE}recipe-captures/${captureId}`));
      if (!this.alive || this.draft.captureId !== captureId) return;
      this.notice = '';
      this.draft.status = job.status;
      if (job.status === 'completed') this.draft.result = job.result;
      if (job.status === 'failed') this.error = this.t('generateError');
      this.persist();
    } catch (error: any) {
      if (this.alive && this.draft.captureId === captureId && error?.status === 404) { delete this.draft.captureId; this.draft.status = 'failed'; this.error = this.t('generateError'); this.persist(); }
      else if (this.alive && this.draft.captureId === captureId) this.notice = this.t('offline');
    } finally { this.polling = false; }
  }
  async edit(useResult: boolean) {
    if (!useResult && this.draft.keep && this.playback) {
      if (this.pendingResult) return;
      this.loading = true; this.error = '';
      try { await this.uploadRecording(); }
      catch { this.error = this.t('generateError'); return; }
      finally { this.loading = false; }
    }
    const result = useResult ? this.draft.result : undefined;
    this.draft.recipe = { name: result?.name || '', image_url: this.draft.photo || '', description: '', ingredients: (result?.ingredients || []).map(text => ({ text })), instructions: { mode: 'steps', steps: result?.steps || [] }, visibility: 'private', tags: [], captureId: ['completed', 'uploaded', 'failed'].includes(this.draft.status || '') ? this.draft.captureId : undefined, keepRecording: !!this.draft.keep };
    this.persist(); void this.router.navigate(['/new']);
  }
  format(value: string[]) { return value?.join('\n') || ''; }
  setLines(field: 'ingredients' | 'steps', value: string) {
    if (!this.draft.result) return;
    this.draft.result[field] = value.split(/\r?\n/);
    this.persist();
  }
}
