import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends CRUDService<Category> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = Global.ENDPOINTS.CATEGORY
   }
   
}
