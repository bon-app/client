import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'app-preparing-form',
    templateUrl: './preparing-form.component.html',
    styleUrls: ['./preparing-form.component.scss'],
    standalone: false
})
export class PreparingFormComponent extends FieldType implements OnInit {


  get modelKey(): string {
    const key = this.field?.key;
    return Array.isArray(key) ? String(key[0]) : String(key ?? '');
  }

  constructor() {
    super()
  }


  ngOnInit() {
    const value = this.model[this.modelKey];
    this.model[this.modelKey] = Array.isArray(value) ? value : value ? [value] : [];
    this.formControl.setValue(this.model[this.modelKey]);
  }
  addStep() { this.formControl.setValue(this.model[this.modelKey] = [...this.model[this.modelKey], '']); }
  editStep(event: any, index: number) {
    const next = [...this.model[this.modelKey]];
    next[index] = event.detail?.value ?? event.target?.value ?? '';
    this.formControl.setValue(this.model[this.modelKey] = next);
  }
  removeStep(index: number) {
    this.formControl.setValue(this.model[this.modelKey] = this.model[this.modelKey].filter((_, i) => i !== index));
  }
}
