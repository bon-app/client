import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  standalone: false,
  selector: 'formly-field-bonapp-input',
  template: `
    <ion-item>
      <ion-label position="stacked">{{ props.label }}</ion-label>
      <ion-input
        [type]="props.type || 'text'"
        [step]="props.step"
        [placeholder]="props.placeholder"
        [required]="props.required"
        [formControl]="formControl"
        [formlyAttributes]="field">
      </ion-input>
    </ion-item>
    <formly-validation-message [field]="field"></formly-validation-message>
  `,
})
export class FormlyIonicInputType extends FieldType {}

@Component({
  standalone: false,
  selector: 'formly-field-bonapp-checkbox',
  template: `
    <ion-item lines="none">
      <ion-checkbox
        [required]="props.required"
        [formControl]="formControl"
        [formlyAttributes]="field">
        {{ props.label }}
      </ion-checkbox>
    </ion-item>
    <formly-validation-message [field]="field"></formly-validation-message>
  `,
})
export class FormlyIonicCheckboxType extends FieldType {}

@Component({
  standalone: false,
  selector: 'formly-field-bonapp-select',
  template: `
    <ion-item>
      <ion-label position="stacked">{{ props.label }}</ion-label>
      <ion-select
        [multiple]="props.multiple"
        [placeholder]="props.placeholder"
        [required]="props.required"
        [formControl]="formControl"
        [formlyAttributes]="field">
        @for (option of (props.options || []); track option.value) {
          <ion-select-option [value]="option.value">
          {{ option.label }}
          </ion-select-option>
        }
      </ion-select>
    </ion-item>
    <formly-validation-message [field]="field"></formly-validation-message>
  `,
})
export class FormlyIonicSelectType extends FieldType {}
