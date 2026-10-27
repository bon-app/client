import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Global } from './global';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPaymentIntent(request: { pm_id: string, receipt_email: string, order: Order }) {
    return firstValueFrom(this.http.post<any>(`${Global.ENDPOINTS.PAYMENT}/intent`, request));
  }

  createPayPalOrder(request: { order: Order; receipt_email: string }) {
    return firstValueFrom(this.http.post<{ id: string }>(`${Global.ENDPOINTS.PAYMENT}/paypal/orders`, request));
  }

  capturePayPalOrder(paypalOrderId: string) {
    return firstValueFrom(this.http.post<{ orderId: string; status: string }>(
      `${Global.ENDPOINTS.PAYMENT}/paypal/orders/${encodeURIComponent(paypalOrderId)}/capture`, {}
    ));
  }

}
