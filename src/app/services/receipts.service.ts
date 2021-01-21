import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Receipt } from '../models/receipt.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService extends CRUDService<Receipt> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = Global.ENDPOINTS.RECEIPT
   }

}
