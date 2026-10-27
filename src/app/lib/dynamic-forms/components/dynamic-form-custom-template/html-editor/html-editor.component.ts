import { AfterViewInit, Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Jodit } from 'jodit';


@Component({
    selector: 'app-html-editor',
    templateUrl: './html-editor.component.html',
    styleUrls: ['./html-editor.component.scss'],
    standalone: false
})
export class HtmlEditorComponent extends FieldType implements AfterViewInit, OnDestroy {
  @ViewChild('editor', { static: true }) editorElement: ElementRef<HTMLTextAreaElement>;
  private editor: Jodit;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.editor = Jodit.make(this.editorElement.nativeElement, {
      buttons: 'bold,strikethrough,underline,italic,ul,ol',
      placeholder: this.field.templateOptions?.placeholder || '',
      events: {
        change: () => this.formControl.patchValue(this.editor.value),
      },
    });
    this.editor.value = this.formControl.value || this.model[this.field.key as string] || '';
  }

  ngOnDestroy() {
    this.editor?.destruct();
  }
}
