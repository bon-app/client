import { JwtHelperService } from "@auth0/angular-jwt";

export class Global {
  
  public static ENDPOINTS = {
    // BASE: 'http://localhost:3000/dev',
    // USERS: 'http://localhost:3000/dev/users',
    // RECEIPT: 'http://localhost:3000/dev/receipts',
    // CATEGORY: 'http://localhost:3000/dev/categories',
    // PAYMENT: 'http://localhost:3000/dev/payments',
    // INGREDIENTS: 'http://localhost:3000/dev/ingredients',
    // ORDERS: 'http://localhost:3000/dev/orders',
    // RIMS: 'http://localhost:3000/dev/rims',
    // IMAGES: 'http://localhost:3000/dev/images',
    BASE: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/',
    USERS: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/users',
    RECEIPT: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/receipts',
    CATEGORY: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/categories',
    PAYMENT: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/payments',
    INGREDIENTS: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/ingredients',
    ORDERS: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/orders',
    RIMS: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/rims',
    IMAGES: 'https://lz8reiflz6.execute-api.eu-west-3.amazonaws.com/dev/images',
  }

  public static STRIPE_KEY: string = 'pk_test_51I8QppHjOfILFTWVorIfk1b81ydI4vvKE0Ix4bSuhea9ce5RixdxM2UkzDZgyfAKW52HNTl5EAg2kwkdhdpdOUIV00GbVAnEHQ';

  public static jwt_helper = new JwtHelperService();


}