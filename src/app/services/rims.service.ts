import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DynamicService } from '../lib/dynamic-forms/decorators/dynamic-service.decorator';
import { ReceiptIngredientsMatching } from '../models/receipt-ingredientsMatching.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
@DynamicService()
export class RimsService extends CRUDService<ReceiptIngredientsMatching> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = Global.ENDPOINTS.RIMS;
  }
}