import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface AutoCompleteProvider {
  getResults(query: string): Promise<any[] | false>;
  labelAttribute?: string;
  formValueAttribute?: string;
}

@Component({
  selector: 'app-autocomplete',
  template: `
    <ion-searchbar [(ngModel)]="query" [placeholder]="placeholder" [debounce]="200" (ionInput)="search($event)"></ion-searchbar>
    @if (results.length) {
      <ion-list>
        @for (item of results; track item) {
          <ion-item button detail="false" (click)="select(item)">
            <ion-label>{{ displayValue(item) }}</ion-label>
          </ion-item>
        }
      </ion-list>
    }
    `,
  styles: [`ion-list { max-height: 240px; overflow: auto; }`],
  standalone: false
})
export class AutocompleteComponent {
  @Input() dataProvider: AutoCompleteProvider;
  @Input() maxResults = 50;
  @Input() placeholder = 'Search';
  @Output() itemSelected = new EventEmitter<any>();
  query = '';
  results: any[] = [];
  private requestId = 0;

  async search(event: any) {
    this.query = event?.detail?.value ?? this.query;
    const id = ++this.requestId;
    if (!this.query || !this.dataProvider) { this.results = []; return; }
    const results = await this.dataProvider.getResults(this.query);
    if (id === this.requestId) this.results = (results || []).slice(0, this.maxResults);
  }

  displayValue(item: any): string {
    return item?.[this.dataProvider?.formValueAttribute || this.dataProvider?.labelAttribute || 'name'] ?? item?.name ?? '';
  }

  select(item: any) { this.itemSelected.emit(item); this.clearValue(); }
  clearValue() { this.query = ''; this.results = []; this.requestId++; }
}
