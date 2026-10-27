import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DynamicService } from '../lib/dynamic-forms/decorators/dynamic-service.decorator';
import { Order } from '../models/order.model';
import { CRUDService } from './crud.service';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
@DynamicService()
export class OrdersService extends CRUDService<Order> {

  constructor(protected http: HttpClient) {
    super(http);
    this.endpoint = Global.ENDPOINTS.ORDERS
   }

}
