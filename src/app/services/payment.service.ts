import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPaymentIntent(request: { pm_id: string, receipt_email: string, order: Order }) {
    return this.http.post<any>(`${Global.ENDPOINTS.PAYMENT}/intent`, request).toPromise();
  }

}
