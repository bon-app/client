import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService extends CRUDService<Ingredient> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = Global.ENDPOINTS.INGREDIENTS
   }

}
