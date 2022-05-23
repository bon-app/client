import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { DEFAULT_IMAGE } from './default-image';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-upload-image-preview',
  templateUrl: './upload-image-preview.component.html',
  styleUrls: ['./upload-image-preview.component.scss'],
})
export class UploadImagePreviewComponent extends FieldType implements OnInit {

  public defaultImage: string = DEFAULT_IMAGE;

  constructor(
    public platform: Platform
  ) {
    super();
    let isApp;
    // console.log(document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8100'));
    document.URL.startsWith('http')? isApp = false: isApp = true;
    console.log({isApp});
    
  }

  ngOnInit() {
    setTimeout(() => {
      this.setPreview()
    }, 500)
  }

  setPreview(image = null) {
    document.querySelector<HTMLDivElement>('#image-wrapper').style.background = `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(9,9,121,1) 0%, rgba(0,0,0,0.6) 0%), url("${image || this.model[this.field.key as string] || this.defaultImage}") center center no-repeat`;
    document.querySelector<HTMLDivElement>('#image-wrapper').style.backgroundSize = `contain`;
  }

  previewImage($event) {
    console.log($event)
    let input = $event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.model[this.field.key as string] = e.target.result;
        this.setPreview();
        this.formControl.patchValue(this.model[this.field.key as string]);
        // console.log(e.target);

      }
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }

}
