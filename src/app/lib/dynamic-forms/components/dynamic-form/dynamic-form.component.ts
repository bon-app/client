import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EntityConfig } from '../../core/entity.config';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {

  @Input("model") model: any = {};
  @Input("config") config: EntityConfig;
  @Output("save") onsave: EventEmitter<any> = new EventEmitter<any>();
  @Output("cancel") oncancel: EventEmitter<any> = new EventEmitter<any>();

  public form = new FormGroup({});

  constructor() { }

  ngOnInit() { }

  save() {
    this.onsave.emit(this.model);
  }
  cancel() {
    this.oncancel.emit(this.model);
  }

}
