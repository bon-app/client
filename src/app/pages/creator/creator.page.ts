import { Component, OnInit } from "@angular/core";
import { Receipt } from "src/app/models/receipt.model";
import { ReceiptsService } from "src/app/services/receipts.service";
import { ActivatedRoute } from "@angular/router";
import { AutoCompleteService } from "ionic4-auto-complete";
import { RimsService } from "src/app/services/rims.service";
import { LoadingController, NavController } from '@ionic/angular';



@Component({
  selector: "app-creator",
  templateUrl: "./creator.page.html",
  styleUrls: ["./creator.page.scss"],
})
export class CreatorPage implements OnInit {
  fromCreator: boolean = false;
  userName: string;
  
  public isShow: boolean = true;
  public receipts: Receipt[] = [];
  public selected_rim: any;
  public _filter = {
    tags: [],
    active: true, 
  };
  public filter: any = { active: true };
  rimsProvider: RimsDataProvider;


  constructor(
    private route: ActivatedRoute,
    private receiptsService: ReceiptsService,
    private rimsService: RimsService,
    public navCtrl: NavController,


  ) {
    this.userName = this.route.snapshot.paramMap.get("username");
    this.rimsProvider = new RimsDataProvider(rimsService);

  }

  ngOnInit() {
    this.getCreatorRecipes();
  }

  async getCreatorRecipes(event: any = null, force: boolean = false) {
    this.fromCreator = true;
    let skip = force ? 0 : this.receipts.length || 0;

    if (skip > 0 && !force) {
      this.receipts.push(
        ...(await this.receiptsService.findByUser(
          this.userName,
          this.filter,
          ["-__v"],
          skip,
          12,
          "-priority",
          ["ingredients.ingredient"]
        ))
      );
      if (event) event.target.complete();
      return;
    }
    this.receipts = await this.receiptsService.findByUser(
      this.userName,
      this.filter,
      ["-__v"],
      skip,
      12,
      "-priority",
      ["ingredients.ingredient"]
    );
    console.log("receipts", this.receipts);

    if (event) event.target.complete();
  }

  goto(url: string) {
    this.navCtrl.navigateForward(url);
  }

  async onChangeFilter(value) {
    if (this._filter.tags.indexOf(value) > -1) {
      this._filter.tags = this._filter.tags.filter((t) => t != value);
    } else {
      this._filter.tags.push(value);
    }
    await this.createFilter();
  }

  async createFilter() {
    let filter: any = { active: true };
    if (this._filter.tags.length) {
      filter.tags = { $all: this._filter.tags };
    }
    if (this.selected_rim) {
      filter["ingredients.ingredient"] = { $in: [this.selected_rim.id] };
    }
    this.filter = filter;
    await this.getCreatorRecipes(null, true);
  }

  selectedRim(rim = null) {
    this.selected_rim = rim;
    this.createFilter();
  }
}


export class RimsDataProvider implements AutoCompleteService {
  labelAttribute = "id";
  formValueAttribute = "_name";
  field;

  constructor(private service: RimsService) {}

  async getResults(keyword: string) {
    if (!keyword) {
      return false;
    }

    return (
      await this.service.find(
        { name: { $regex: `.*${keyword}.*`, $options: "i" } },
        ["-__v"],
        0,
        25,
        { name: 1 }
      )
    ).filter((item) => {
      (<any>item)._name = item.name;
      return item;
    });
  }
}
