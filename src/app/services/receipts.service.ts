import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DynamicService } from '../lib/dynamic-forms/decorators/dynamic-service.decorator';
import { Receipt } from '../models/receipt.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
@DynamicService()
export class ReceiptsService extends CRUDService<Receipt> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = Global.ENDPOINTS.RECEIPT;
    this.defaulSort = '-priority'
   }

}
