import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment";

export class Global {
  
  public static ENDPOINTS = {
    BASE: environment.apiBaseUrl,
    USERS: `${environment.apiBaseUrl}users`,
    RECEIPT: `${environment.apiBaseUrl}receipts`,
    CATEGORY: `${environment.apiBaseUrl}categories`,
    PAYMENT: `${environment.apiBaseUrl}payments`,
    INGREDIENTS: `${environment.apiBaseUrl}ingredients`,
    ORDERS: `${environment.apiBaseUrl}orders`,
    RIMS: `${environment.apiBaseUrl}rims`,
    IMAGES: `${environment.apiBaseUrl}images`,
  };

  public static STRIPE_KEY = environment.stripePublishableKey;
  public static PAYPAL_ENABLED = environment.paypalEnabled;
  public static PAYPAL_CLIENT_ID = environment.paypalClientId;
  public static PAYPAL_SDK_URL = environment.paypalSandbox
    ? 'https://www.sandbox.paypal.com/web-sdk/v6/core'
    : 'https://www.paypal.com/web-sdk/v6/core';

  public static jwt_helper = new JwtHelperService();


}