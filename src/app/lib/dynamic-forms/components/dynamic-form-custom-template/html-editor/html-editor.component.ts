import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';



@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],

})
export class HtmlEditorComponent extends FieldType implements OnInit {

  public show: boolean;
  public editor: any

  constructor() {
    super();
    console.log("Jodit: ", this.show)
    this.show = true;
    console.log("Jodit: ", this.show)
  }

  ngOnInit() {
    console.log("Jodit: ", this.show)
    this.show = true;
    console.log("Jodit: ", this.show)
  }

}
