import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EntityConfig } from '../../core/entity.config';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {

  @Input("DEBUG") DEBUG: boolean = false;
  @Input("model") model: any = {};
  @Input("config") config: EntityConfig;
  @Output("save") onsave: EventEmitter<any> = new EventEmitter<any>();
  @Output("cancel") oncancel: EventEmitter<any> = new EventEmitter<any>();

  public form = new FormGroup({});

  constructor() { } 

  ngOnInit() { 
  }

  save() {
    this.onsave.emit(this.model);
  }
  cancel() {
    this.oncancel.emit(this.model);
  }

  getFormValidationErrors() {
    let errors = [];
    Object.keys(this.form.controls).forEach(key => {

      const controlErrors: any = this.form.get(key).errors;
      if (controlErrors != null) {
        errors.push({ key, err: controlErrors });
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
    return errors;
  }

}

