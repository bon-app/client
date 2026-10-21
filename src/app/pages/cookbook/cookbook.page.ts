import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular/lazy';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { firstValueFrom, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslateCompatModule } from '../../shared/translate-compat.module';
import { ComponentsModule } from '../../components/components.module';
import { LoginComponent } from '../../components/login/login.component';
import { AuthService } from '../../auth/auth.service';
import { Global } from '../../services/global';
import { imageData, ingredientLines, instructionPreview, moveItem, RecipeInstructions } from './recipe-editor';

@Component({ selector: 'app-cookbook', standalone: true, imports: [CommonModule, FormsModule, RouterModule, IonicModule, ComponentsModule, TranslateCompatModule], templateUrl: './cookbook.page.html', styleUrls: ['./cookbook.page.scss'] })
export class CookbookPage implements OnInit, OnDestroy {
  mode = ''; recipes: any[] = []; recipe: any; profile: any = {}; user: any;
  loading = false; saving = false; imageLoading = false; error = ''; saved = ''; search = ''; visibility = ''; selectedTag = ''; hasMore = false;
  filterCatalogueQuery = ''; filterMatches: any[] = []; catalogueFilter: any = null; filterCatalogueError = false;
  bulk = ''; catalogueQuery: Record<number, string> = {}; matches: Record<number, any[]> = {}; catalogueErrors: Record<number, boolean> = {};
  preview: RecipeInstructions | null = null; attempted = false; progress: number | null = null;
  tags = ['healthy', 'quick-n-easy', 'first', 'second', 'vegetarian', 'gluten-free', 'no-oven', 'no-mixer'];
  private baseline = ''; private sub?: Subscription; private requests = new Subscription(); private version = 0;
  private refreshTimer?: ReturnType<typeof setInterval>;
  constructor(public auth: AuthService, private http: HttpClient, private route: ActivatedRoute, public router: Router, private modal: ModalController, private translate: TranslateService) {}
  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(() => void this.load());
    this.refreshTimer = setInterval(() => { if (!this.dirty && !this.saving) void this.load(); }, 12 * 60 * 1000);
  }
  ionViewWillEnter() { if (!this.loading) void this.load(); }
  ngOnDestroy() { this.version++; this.sub?.unsubscribe(); this.requests.unsubscribe(); if (this.refreshTimer) clearInterval(this.refreshTimer); }
  get authenticated() { return this.auth.isAuthenticate(); }
  get owner() { return this.authenticated && (this.auth.hasRoles(['admin']) || this.recipe && String(this.recipe.fk_user) === String(this.auth.getIdentity()?.id)); }
  get dirty() { return ['editor', 'profile'].includes(this.mode) && !!this.baseline && this.snapshot() !== this.baseline; }
  snapshot() { return JSON.stringify(this.mode === 'profile' ? this.profile : { recipe: this.recipe, bulk: this.bulk }); }
  @HostListener('window:beforeunload', ['$event']) beforeUnload(event: BeforeUnloadEvent) { if (this.dirty || this.saving) { event.preventDefault(); event.returnValue = ''; } }
  canLeave() { return this.saving ? false : !this.dirty || window.confirm(this.t('leave')); }
  t(key: string) { return this.translate.instant('Cookbook.' + key); }
  message(error: any) { const code = error?.error?.code || error?.message; const key = 'Cookbook.errors.' + code; const value = this.translate.instant(key); return value === key ? this.t('failed') : value; }
  reportError(error: any) {
    this.error = this.message(error);
    setTimeout(() => document.getElementById('cookbook-error')?.focus(), 0);
  }
  async login(signin = false) {
    const modal = await this.modal.create({ component: LoginComponent, componentProps: { section: signin ? 'signin' : 'login' }, cssClass: ['auto-height'] });
    await modal.present(); await modal.onDidDismiss();
    if (this.authenticated) { if (this.mode === 'discover') await this.router.navigate(['/cookbook']); else await this.load(); }
  }
  async load() {
    const current = ++this.version;
    this.mode = this.route.snapshot.data['mode'] || 'creator';
    this.error = ''; this.saved = ''; this.loading = true; this.user = null; this.recipe = null; this.profile = {}; this.baseline = ''; this.bulk = ''; this.preview = null; this.attempted = false;
    try {
      if (['cookbook', 'editor', 'profile'].includes(this.mode) && !this.authenticated) return;
      if (this.mode === 'editor' || this.mode === 'detail') {
        const id = this.route.snapshot.paramMap.get('id');
        const recipe = id ? await firstValueFrom(this.http.get<any>(`${Global.ENDPOINTS.RECEIPT}/${id}`)) : { name: '', image_url: '', description: '', ingredients: [], instructions: { mode: 'text', text: '' }, visibility: 'private', tags: [] };
        if (current !== this.version) return;
        this.recipe = recipe;
        if (this.mode === 'editor' && id && !this.owner) { this.recipe = null; throw new Error('_UNAUTHORIZE'); }
        this.baseline = this.snapshot();
        if (recipe.fk_user) { try { this.user = await firstValueFrom(this.http.get<any>(`${Global.ENDPOINTS.USERS}/${recipe.fk_user}`)); } catch { this.user = null; } }
      } else if (this.mode === 'profile') {
        this.profile = await firstValueFrom(this.http.get<any>(`${Global.ENDPOINTS.USERS}/${this.auth.getIdentity().id}`));
        this.baseline = this.snapshot();
      } else if (['discover', 'cookbook', 'creator'].includes(this.mode)) await this.fetchRecipes(true);
    } catch (e) { if (current === this.version) this.reportError(e); }
    finally { if (current === this.version) this.loading = false; }
  }
  async fetchRecipes(reset = true) {
    this.loading = true; this.error = '';
    try {
      const filter: any = {};
      if (this.visibility && this.mode === 'cookbook') filter.visibility = this.visibility;
      if (this.selectedTag) filter.tags = { $all: [this.selectedTag] };
      const params: any = { skip: reset ? 0 : this.recipes.length, take: 24, filter: JSON.stringify(filter), q: this.search };
      if (this.catalogueFilter) params.catalogueId = this.catalogueFilter.id;
      if (this.mode === 'cookbook') params.mine = 'true'; else params.public = 'true';
      const url = this.mode === 'creator' ? `${Global.ENDPOINTS.RECEIPT}/creator/${encodeURIComponent(this.route.snapshot.paramMap.get('username') || '')}` : Global.ENDPOINTS.RECEIPT;
      const result = await firstValueFrom(this.http.get<any>(url, { params }));
      const docs = this.mode === 'creator' ? result.docs : result;
      if (this.mode === 'creator') this.user = result.user;
      this.recipes = reset ? docs : [...this.recipes, ...docs]; this.hasMore = docs.length === 24;
    } catch (e) { this.reportError(e); }
    finally { this.loading = false; }
  }
  async searchFilterCatalogue() {
    if (!this.filterCatalogueQuery.trim()) return;
    this.filterCatalogueError = false;
    try {
      const escaped = this.filterCatalogueQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      this.filterMatches = await firstValueFrom(this.http.get<any[]>(Global.ENDPOINTS.RIMS, { params: { filter: JSON.stringify({ name: { $regex: escaped, $options: 'i' } }), take: 10 } }));
    } catch { this.filterCatalogueError = true; this.filterMatches = []; }
  }
  selectCatalogueFilter(item: any) { this.catalogueFilter = item; this.filterMatches = []; void this.fetchRecipes(); }
  addLines() { this.recipe.ingredients.push(...ingredientLines(this.bulk)); this.bulk = ''; }
  move(items: any[], i: number, direction: number) { moveItem(items, i, direction); this.matches = {}; this.catalogueQuery = {}; }
  removeLine(i: number) { this.recipe.ingredients.splice(i, 1); this.matches = {}; this.catalogueQuery = {}; }
  async searchCatalogue(i: number) {
    const query = (this.catalogueQuery[i] || '').trim(); if (!query) { this.matches[i] = []; return; }
    this.catalogueErrors[i] = false;
    const line = this.recipe.ingredients[i];
    try {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const results = await firstValueFrom(this.http.get<any[]>(Global.ENDPOINTS.RIMS, { params: { filter: JSON.stringify({ name: { $regex: escaped, $options: 'i' } }), take: 10 } }));
      if (line === this.recipe.ingredients[i] && query === (this.catalogueQuery[i] || '').trim()) this.matches[i] = results;
    } catch { this.catalogueErrors[i] = true; this.matches[i] = []; }
  }
  link(i: number, item: any) { this.recipe.ingredients[i].catalogueId = item.id; this.matches[i] = []; }
  toggleTag(tag: string) { const tags = this.recipe.tags ||= []; this.recipe.tags = tags.includes(tag) ? tags.filter((t: string) => t !== tag) : [...tags, tag]; }
  convert() { this.preview = instructionPreview(this.recipe.instructions); }
  acceptConversion() { this.recipe.instructions = this.preview; this.preview = null; }
  async chooseImage(event: Event, avatar = false) {
    const input = event.target as HTMLInputElement, file = input.files?.[0]; if (!file) return;
    this.imageLoading = true; this.error = '';
    try { const data = await imageData(file); if (avatar) this.profile.image_url = data; else this.recipe.image_url = data; }
    catch (e) { this.reportError(e); } finally { this.imageLoading = false; input.value = ''; }
  }
  saveRecipe() {
    if (this.saving || this.imageLoading) return;
    this.attempted = true; this.error = ''; this.saved = '';
    if (!this.recipe.name?.trim() || !this.recipe.image_url) { this.error = this.t('required'); setTimeout(() => document.getElementById(!this.recipe.name?.trim() ? 'recipe-title' : 'recipe-image')?.focus(), 0); return; }
    if (this.bulk.trim()) this.addLines();
    this.saving = true; this.progress = null;
    const request = this.http.request<any>(this.recipe.id ? 'PUT' : 'POST', Global.ENDPOINTS.RECEIPT, { body: this.recipe, observe: 'events', reportProgress: true });
    this.requests.add(request.subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress) this.progress = event.total ? Math.round(100 * event.loaded / event.total) : null;
        if (event.type === HttpEventType.Response) { this.recipe = event.body; this.bulk = ''; this.baseline = this.snapshot(); this.saving = false; void this.router.navigate(['/receipt', this.recipe.id]); }
      }, error: e => { this.reportError(e); this.saving = false; this.progress = null; }
    }));
  }
  async saveProfile() {
    if (this.saving || this.imageLoading) return; this.saving = true; this.error = ''; this.saved = '';
    try {
      const result = await firstValueFrom(this.http.put<any>(Global.ENDPOINTS.USERS, this.profile));
      this.auth.setToken(result.token); delete result.token; this.auth.setIdentity(result); this.profile = result;
      this.baseline = this.snapshot(); this.saved = this.t('saved');
    } catch (e) { this.reportError(e); } finally { this.saving = false; }
  }
  async setVisibility(recipe: any) {
    if (this.saving) return; this.saving = true; this.error = '';
    try {
      const updated = await firstValueFrom(this.http.put<any>(Global.ENDPOINTS.RECEIPT, { id: recipe.id, visibility: recipe.visibility === 'public' ? 'private' : 'public' }));
      Object.assign(recipe, updated); if (this.visibility && recipe.visibility !== this.visibility) this.recipes = this.recipes.filter(r => r.id !== recipe.id);
    } catch (e) { this.reportError(e); } finally { this.saving = false; }
  }
  async deleteRecipe(recipe: any) {
    if (this.saving || !window.confirm(this.t('deleteConfirm'))) return;
    this.saving = true; this.error = '';
    try { await firstValueFrom(this.http.delete(`${Global.ENDPOINTS.RECEIPT}/${recipe.id}`)); this.recipes = this.recipes.filter(r => r.id !== recipe.id); }
    catch (e) { this.reportError(e); } finally { this.saving = false; }
  }
}
