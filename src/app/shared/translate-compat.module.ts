import { NgModule } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

/** Exposes ngx-translate v18's standalone template API to legacy feature NgModules. */
@NgModule({
  imports: [TranslateDirective, TranslatePipe],
  exports: [TranslateDirective, TranslatePipe],
})
export class TranslateCompatModule {}
