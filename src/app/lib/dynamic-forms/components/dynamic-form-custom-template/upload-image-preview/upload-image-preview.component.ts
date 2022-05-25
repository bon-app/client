import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { DEFAULT_IMAGE } from './default-image';
import {
  ActionSheetController,
  LoadingController,
  Platform,
} from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-upload-image-preview',
  templateUrl: './upload-image-preview.component.html',
  styleUrls: ['./upload-image-preview.component.scss'],
})
export class UploadImagePreviewComponent extends FieldType implements OnInit {
  public defaultImage: string = DEFAULT_IMAGE;
  isApp: string;
  drawImage: string;
  capturedSnapURL: string;

  constructor(
    private camera: Camera,
    public platform: Platform,
    public actionSheetController: ActionSheetController,
    private loadingCtrl: LoadingController
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

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: 1,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: false,
    };
    this.camera.getPicture(options).then(
      async (imageData: any) => {
        const loading = await this.loadingCtrl.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
        });
        loading.present();

        console.log({ imageData });
        loading.dismiss();

        this.capturedSnapURL = 'data:image/jpeg;base64,' + imageData;
        const img = new Image();
        img.src = 'data:image/jpeg;base64,' + imageData;

        img.onload = () => {
          this.model[this.field.key as string] = img.src;
          this.setPreview();
          this.formControl.patchValue(this.model[this.field.key as string]);
          loading.dismiss();
        };
      },
      (err) => {
        // Handle error
      }
    );
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
            this.takePicture();
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
