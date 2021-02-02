import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BAImage } from '../models/image.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class ImagesService extends CRUDService<BAImage> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = Global.ENDPOINTS.IMAGES
   }
   
}
