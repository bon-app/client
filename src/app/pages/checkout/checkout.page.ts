import { Component, HostListener, OnInit, } from '@angular/core';
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { LoginComponent } from 'src/app/components/login/login.component';
import { AuthService } from 'src/app/auth/auth.service';
import { AddressFormComponent } from 'src/app/components/address-form/address-form.component';
import { Global } from 'src/app/services/global';
import { PaymentService } from 'src/app/services/payment.service';
import { ICreateOrderRequest, IPayPalConfig, IPurchaseUnit } from 'ngx-paypal';

declare var Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  public form: HTMLDivElement;

  public stripe: any;
  public card: any;
  public user: User;
  public addMethod: boolean = true;
  public saveCard: boolean = false;
  public order: Order = new Order();
  public delivery_times: string[] = ['19:15 - 19:30', '19:30 - 19:45', '19:45 - 20:00', '20:00 - 20:15', '20:15 - 20:30', '20:30 - 20:45'];
  public selectedPayment: string;
  public payments: { id: string, last4: string }[] = [
    { id: 'P123456', last4: '4589' },
    { id: 'P123457', last4: '3578' },
  ];

  public payPalConfig?: IPayPalConfig;

  constructor(
    public cart: CartService,
    public navCtrl: NavController,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private paymentService: PaymentService
  ) {
    this.stripe = Stripe(Global.STRIPE_KEY);
  }

  async ngOnInit() {
    this.createPaymentForm();
    // this.initConfig();
    this.order.delivery_time = 'asap';
    this.order.delivery_method = 'standard';

    if (!this.auth.isAuthenticate()) {
      await this.openLoginModal(true);
      return;
    }
    this.setUser();
    this.selectAddress(null);
  }

  getTotal() {
    return this.cart.total + (this.order.delivery_method == 'standard' ? 0.99 : 2.49);
  }

  selectAddress(address: any) {
    this.order.address = address;
    for (let a of this.user.addresses) {
      (a as any).selected = false;
    }
    if (address) {
      address.selected = true;
    }
  }

  addPayment() {
    let cardElment = document.querySelector<any>('input[name="cardnumber"]');
    let last4 = cardElment.value.split(' ').pop();
    this.payments.push({ id: 'new-' + Date.now(), last4 });
    this.addMethod = false;
  }

  async openLoginModal(signin: boolean = false) {
    let modal = await this.modalCtrl.create({
      component: LoginComponent,
      componentProps: {
        section: signin ? 'signin' : 'login'
      },
      backdropDismiss: false,
      swipeToClose: false,
      cssClass: ['auto-height']
    });

    modal.present();

    modal.onDidDismiss().then(res => {
      this.setUser();
    });
  }

  async openAddressModal() {
    let modal = await this.modalCtrl.create({
      component: AddressFormComponent,
      backdropDismiss: false,
      swipeToClose: false,
      cssClass: ['auto-height']
    });

    modal.present();
  }

  setUser() {
    this.user = this.auth.getIdentity();
    this.order.name = `${this.user.surname} ${this.user.name}`;
    this.order.phone = `${this.user.phone}`;
  }

  createPaymentForm() {

    setTimeout(() => {
      var elements = this.stripe.elements();

      var style = {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          fontWeight: '300',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
          '::placeholder': {
            color: '#CFD7E0'
          }
        }
      };

      // <div id="card-element"></div>
      // <div id="card-errors" role="alert"></div>
      this.form = document.querySelector<HTMLDivElement>('#stripe-card');
      const card = document.createElement("div");
      const err = document.createElement("div")
      card.setAttribute("id", "card-element");
      err.setAttribute("id", "card-errors");
      err.setAttribute("role", "alert");
      this.form.appendChild(card);
      this.form.appendChild(err);

      // Create an instance of the card Element.
      this.card = elements.create('card', { style: style, hidePostalCode: true, iconStyle: 'solid' });
      this.card.mount(card);

      this.card.addEventListener('change', ({ error }) => {
        const displayError = document.getElementById('card-errors');
        if (error) {
          displayError.textContent = error.message;
          return;
        }
        displayError.textContent = '';
      });
    }, 100)


  }

  async payWithCard() {


    if (!this.order.address) {
      let toast = await this.toastCtrl.create({ message: this.translate.instant("Errors._NO_ORDER_ADDRESS"), duration: 5000 });
      toast.present();
      return
    }

    if ((this.selectedPayment && !this.addMethod) || (this.selectedPayment && this.addMethod)) {
      let toast = await this.toastCtrl.create({ message: this.translate.instant("Errors._NO_ORDER_PAYMENT"), duration: 5000 });
      toast.present();
      return
    }

    let loading = await this.loadingCtrl.create({ message: "loading..." })
    loading.present();

    this.order.info = this.cart.items;
    this.order.shipping_cost = this.order.delivery_method == 'standard' ? 0.99 : 2.49;

    try {
      /** Payment method options */
      let paymentMethodOptions = {
        billing_details: { name: `${this.auth.getIdentity().name} ${this.auth.getIdentity().surname}` }
      };

      /** Create a payment method */
      let result = null;
      if (this.addMethod) {
        result = await this.stripe.createPaymentMethod('card', this.card, paymentMethodOptions)
        if (result.error) {
          let toast = await this.toastCtrl.create({ message: result.error.message, duration: 5000 });
          toast.present();
          loading.dismiss();
          return;
        }
      }

      let pm = await this.paymentService.createPaymentIntent({
        pm_id: result.paymentMethod.id,
        order: this.order,
        receipt_email: this.auth.getIdentity().email
      });

      result = await this.stripe.confirmCardPayment(pm.client_secret);

      if (result.error) {
        loading.dismiss();
        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message);
      } else {
        loading.dismiss();
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          this.cart.clear();
          this.navCtrl.navigateRoot('/order-confirm/' + pm.metadata.order)
        }
      }

    } catch (error) {
      let toast = await this.toastCtrl.create({ message: error.error.message, duration: 5000 });
      toast.present();
      loading.dismiss();
    }

  }

  private initConfig(): void {
    let amount = (this.cart.total + (this.order.delivery_method == 'standard' ? 0.99 : 2.49)).toFixed(2);
    let payment: IPurchaseUnit = {
      amount: {
        currency_code: 'EUR',
        value: amount,
        breakdown: {
          item_total: {
            currency_code: 'EUR',
            value: amount
          }
        }
      },
      items: [...this.cart.items.map(i => {
        return {
          name: i.ingredient.brand + ' - ' + i.ingredient.name,
          quantity: '' + i.qta,
          unit_amount: {
            currency_code: 'EUR',
            value: i.ingredient.price.toFixed(2),
          },
        }
      }),
      {
        name: this.order.delivery_method == 'standard' ? "Consegna standard" : "Consegna FootStep",
        quantity: '1',
        unit_amount: {
          currency_code: 'EUR',
          value: this.order.delivery_method == 'standard' ? '0.99' : '2.49',
        },
      }
      ]
    };
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AWYaTJP6VQTX0rciOzG_Lw2Da5ILf_4lhQyYp7engsMtK-HeQeYS2ricKyx5TU13DOupHJ7L0BvOwglt',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [payment],
        // [{
        //   amount: {
        //     currency_code: 'EUR',
        //     value: '9.99',
        //     breakdown: {
        //       item_total: {
        //         currency_code: 'EUR',
        //         value: '9.99'
        //       }
        //     }
        //   },
        //   items: [{
        //     name: 'Enterprise Subscription',
        //     quantity: '1',
        //     category: 'DIGITAL_GOODS',
        //     unit_amount: {
        //       currency_code: 'EUR',
        //       value: '9.99',
        //     },
        //   }]
        // }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'horizontal'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

}
