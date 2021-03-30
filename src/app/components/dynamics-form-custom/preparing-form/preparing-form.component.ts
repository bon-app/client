import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Debounce } from '../../../lib/dynamic-forms/decorators/debounce.decorator';

@Component({
  selector: 'app-preparing-form',
  templateUrl: './preparing-form.component.html',
  styleUrls: ['./preparing-form.component.scss'],
})
export class PreparingFormComponent extends FieldType implements OnInit {


  constructor() {
    super()
  }


  ngOnInit() {
    //this.model = this.model || [];
    setTimeout(() => {
      let value = this.model[this.field.key as string];
      if (typeof value == 'string') {
        let steps = [];
        let div = document.createElement('div');
        div.innerHTML = value;
        for (let strong of Array.from(div.querySelectorAll('strong'))) {
          strong.remove();
        }
        for (let p of Array.from(div.querySelectorAll('p'))) {
          if (p.innerHTML && p.innerHTML != '&nbsp;<br>' && p.innerHTML != '&nbsp;' && p.innerHTML != '<br>') {
            steps.push(p.innerHTML);
          }
        }
        this.model[this.field.key as string] = steps;
        this.formControl.patchValue(this.model[this.field.key as string])

        return;
      }
      this.model[this.field.key as string] = value || [];
      this.formControl.patchValue(this.model[this.field.key as string])

    }, 500);
  }

  addStep() {
    this.model[this.field.key as string].push('');
    this.formControl.patchValue(this.model[this.field.key as string])
  }

  @Debounce(1000)
  editStep($event, index) {
    this.model[this.field.key as string][index] = $event.target.value;
    document.querySelector<HTMLTextAreaElement>(`#step-${index + 1} textarea`).focus();
    this.formControl.patchValue(this.model[this.field.key as string]);
  }

  removeStep(index) {
    if (confirm(`Are you sure you want to delete the step ${index + 1}?`)) {
      this.model[this.field.key as string].splice(index, 1);
      this.formControl.patchValue(this.model[this.field.key as string])

    }
  }

}
