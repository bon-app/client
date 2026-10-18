import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { DEFAULT_IMAGE } from './default-image';
import {
  ActionSheetController,
} from '@ionic/angular/lazy';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
    selector: 'app-upload-image-preview',
    templateUrl: './upload-image-preview.component.html',
    styleUrls: ['./upload-image-preview.component.scss'],
    standalone: false
})
export class UploadImagePreviewComponent extends FieldType implements OnInit {
  public defaultImage: string = DEFAULT_IMAGE;
  isApp: string;
  drawImage: string;
  capturedSnapURL: string;

  constructor(
    public actionSheetController: ActionSheetController
  ) {
    super();
    console.log(Capacitor.getPlatform());

    Capacitor.getPlatform() === 'web'
      ? (this.isApp = 'web')
      : (this.isApp = 'platform');
  }

  ngOnInit() {
    setTimeout(() => {
      this.setPreview();
    }, 500);
  }

  setPreview(image = null) {
    document.querySelector<HTMLDivElement>(
      '#image-wrapper'
    ).style.background = `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(9,9,121,1) 0%, rgba(0,0,0,0.6) 0%), url("${
      image || this.model[this.field.key as string] || this.defaultImage
    }") center center no-repeat`;
    document.querySelector<HTMLDivElement>(
      '#image-wrapper'
    ).style.backgroundSize = `contain`;
  }

  previewImage($event) {
    console.log($event);
    let input = $event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.model[this.field.key as string] = e.target.result;
        this.setPreview();
        this.formControl.patchValue(this.model[this.field.key as string]);
        // console.log(e.target.result);
      };
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }

  async takePicture() {
    try {
      const photo = await Camera.getPhoto({
      quality: 100,
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
        width: 400,
        height: 400,
        saveToGallery: false,
      });
      if (!photo.dataUrl) return;
      this.capturedSnapURL = photo.dataUrl;
      this.model[this.field.key as string] = photo.dataUrl;
      this.setPreview();
      this.formControl.patchValue(photo.dataUrl);
    } catch (error) {
      console.warn('Camera capture was cancelled or unavailable', error);
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            document.getElementById('image').click();
          },
        },
        {
          text: 'Use Camera',
          handler: () => {
            // this.pickImage();
            void this.takePicture();
            console.log('model reaches', this.model);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}
