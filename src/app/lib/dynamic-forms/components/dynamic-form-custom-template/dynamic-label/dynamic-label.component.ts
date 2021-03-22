import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-dynamic-label',
  templateUrl: './dynamic-label.component.html',
  styleUrls: ['./dynamic-label.component.scss'],
})
export class DynamicLabelComponent extends FieldType implements OnInit {

  public value: any;

  constructor() {
    super();
  }

  ngOnInit() {

    setTimeout(() => {
      this.value = this.model[this.field.key as string];

      let args = (!this.field.templateOptions ? '_DEFAULT' : this.field.templateOptions.type || '').split(/\:(?=(?:[^(\'|\")]*\'[^(\'|\")]*\')*[^(\'|\")]*$)/).map(k => k.replace(/('|")/ig, ''));
      let type = args[0];

      switch (type) {
        case 'date':
          this.value = new DatePipe(args[2] || 'en').transform(this.model[this.field.key as string], args[1] || 'yyyy-MM-dd HH:mm');
          break;
        case 'currency':
          this.value = this.value ? `${args[2] || '€'} ${this.value.toFixed(parseInt(args[1] || '2'))}` : ' - '
          break;

        default:
          this.value = this.model[this.field.key as string];
          break;
      }
    }, 500)

  }

}
