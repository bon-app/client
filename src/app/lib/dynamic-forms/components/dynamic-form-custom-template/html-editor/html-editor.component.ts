import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';



@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],

})
export class HtmlEditorComponent extends FieldType implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {

  }

  changeValidation() {
    this.formControl.patchValue(this.model[this.field.key as string]);
  }

}
