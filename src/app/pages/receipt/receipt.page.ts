import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { UsersService } from 'src/app/services/users.service';
import { Receipt } from '../../models/receipt.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {
  public Nickname : any;
  public user: User;

  @Input("receipt") receipt: Receipt;
  // @Input("user") user: User;

  constructor(
    public navCtrl: NavController, 
    private receiptsService: ReceiptsService, 
    private route: ActivatedRoute,
    public usersService: UsersService) 
    { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    try {
      this.receipt = await this.receiptsService.findById(this.route.snapshot.params.id, ['-__v'], ['ingredients.ingredient']);
      this.user = await this.usersService.findById(this.receipt.fk_user,['-__v']);
      if (typeof this.receipt.preparing == 'string') {
        let steps = [];
        let div = document.createElement('div');
        div.innerHTML = this.receipt.preparing;
        for (let strong of Array.from(div.querySelectorAll('strong'))) {
          strong.remove();
        }
        for (let p of Array.from(div.querySelectorAll('p'))) {
          if (p.innerHTML && p.innerHTML != '&nbsp;<br>' && p.innerHTML != ' ' && p.innerHTML != '&nbsp;' && p.innerHTML != '<br>') {
            steps.push(p.innerHTML);
          }
        }
        this.receipt.preparing = steps as any;
        return;
      }
    } catch (error) {

    }
  }

  getIngredientName(ingredient) {
    return typeof ingredient != 'string' ? ingredient.name : ingredient;
  }

}
