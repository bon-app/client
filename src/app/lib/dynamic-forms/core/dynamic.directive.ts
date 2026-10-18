import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dynamic]',
    standalone: false
})
export class DynamicDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}