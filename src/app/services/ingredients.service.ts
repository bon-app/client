import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DynamicService } from '../lib/dynamic-forms/decorators/dynamic-service.decorator';
import { Ingredient } from '../models/ingredient.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
@DynamicService()
export class IngredientsService extends CRUDService<Ingredient> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = Global.ENDPOINTS.INGREDIENTS
  }

  importCSV(ingredients: Ingredient[]) {
    return this.http.post(`${this.endpoint.replace('/ingredients', '')}/import/csv/ingredients`, ingredients).toPromise();
  }

}
