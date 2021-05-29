import { Component, HostListener, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { CartService } from '../../services/cart.service';
import { Receipt } from '../../models/receipt.model';
import { LoadingController, NavController } from '@ionic/angular';
import { ReceiptIngredientsMatching } from 'src/app/models/receipt-ingredientsMatching.model';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { IngredientsService } from 'src/app/services/ingredients.service';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { Ingredient } from 'src/app/models/ingredient.model';
import { Router } from '@angular/router';
import { NullTemplateVisitor } from '@angular/compiler';

@Component({
  selector: 'app-receipt-buy',
  templateUrl: './receipt-buy.page.html',
  styleUrls: ['./receipt-buy.page.scss'],
})
export class ReceiptBuyPage implements OnInit {

  public categories: Category[] = [];
  public ingredients: Ingredient[] = [];
  public ingredientIds: any;
  public selectedCategories: Category[] = [];
  public receipt: Receipt;
  public seach_term: string;
  private topolino: any;
  public selectedSubCategory: Category;

  constructor(
    public router: Router,
    public cart: CartService,
    public receiptsService: ReceiptsService,
    public categoriesService: CategoriesService,
    private ingredientsService: IngredientsService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public route: ActivatedRoute) { }

  ngOnInit() {
    console.log('this.router.url:', this.router.url)
    if (this.router.url.includes('buy')) {
      console.log("this.router.url.includes('buy)')")
    }
    else {
      console.log("this.router.url DOES NOT includes('buy)')")
    }
  }

  // async ionViewWillEnter() {
  //   await this.getReceipts();
  // }

  // async getCategories() {
  //   this.categories = await this.categoriesService.find({ showBeforeCheckout: { $ne: true }, showInShop: true }, ['-__v'], 0, 50, { name: 1 }, ['ingredients', 'subcategories'])
  // }

  async ionViewWillEnter() {
    let loading = await this.loadingCtrl.create({message: 'Loading...'});
    loading.present();
    try {
      // load all categories
      this.categories = await this.categoriesService.find({ showBeforeCheckout: { $ne: true }, showInShop: true }, ['-__v'], 0, 50, { name: 1 }, ['ingredients', 'subcategories'])
      // if user comes from a recipe:
      if (this.route.snapshot.params.id) {
        let receipt = await this.receiptsService.findById(this.route.snapshot.params.id, ['-__v'], ['ingredients.ingredient'])
        let ingrs = [];
        for (let i of receipt.ingredients) {
          let i1: ReceiptIngredientsMatching = i.ingredient as ReceiptIngredientsMatching;
          for (let ii of i1.ingredients) {
            ingrs.push(ii.ingredient);
          }
        }
        // let ingrs = receipt.ingredients.map((i: any) => i.ingredient.ingredients[0] ? i.ingredient.ingredients[0].ingredient : null).filter(i => i != null);
        let ingredients = await this.ingredientsService.find({ $expr: { $in: [{ $toString: '$_id' }, ingrs] } }, ['-__v'], 0, 200, { name: 1 })
        for (let i of receipt.ingredients) {
          for (let i1 of (i.ingredient as ReceiptIngredientsMatching).ingredients) {
            let ingr: string = i1.ingredient as string;
            i1.ingredient = ingredients.find(ing => ing.id == ingr);
          }
        }
        this.receipt = receipt;
      }
      loading.dismiss();

    } catch (error) {
      console.error(error);
      loading.dismiss();
    }
  }

  // only for recipes
  getIngredients(isCondiment: boolean = null) {

    let ingredients = []
    for (let i of this.receipt.ingredients) {
      let rim = i.ingredient as ReceiptIngredientsMatching;
      if (isCondiment !== null && !!rim.isCondiment != isCondiment) {
        continue;
      }
      let first = rim.ingredients.sort((a, b) => a.priority - b.priority)[0];
      if (first) {
        ingredients.push(first.ingredient);
      }
    }
    return ingredients.filter(i => !!i);
  }

  customBack() {
    if (this.receipt || (!this.seach_term && !this.selectedCategories.length)) {
      this.navCtrl.back()
    }
    else {
    this.seach_term = '';
    this.selectedCategories = [];
    this.selectedSubCategory = null;
    }
  }

  goto(url: string) {
    this.navCtrl.navigateForward(url);
  }

  toggleCategory(category: Category) {
    console.log(category)
    this.seach_term = '';
    if (!!this.selectedCategories.find(sc => sc.id == category.id)) {
      console.log("this.selectedCategories",this.selectedCategories)
      console.log("this.selectedCategories.find(sc => sc.id == category.id)",this.selectedCategories.find(sc => sc.id == category.id))
      this.selectedCategories = []; //this.selectedCategories.filter(sc => sc.id != category.id);
      console.log("this.selectedCategories",this.selectedCategories)
    } 
    else {
      // this.selectedCategories.push(category);
      this.selectedCategories = [category];
      console.log("this.selectedCategories",this.selectedCategories)
      console.log("this.selectedCategories[0].subcategories[0]",this.selectedCategories[0].subcategories[0])
      this.toggleSubCategory(this.selectedCategories[0].subcategories[0] as Category)
    }
  }

  async toggleSubCategory(subcategory: Category) {
    console.log('subcategory',subcategory)
    this.ingredientIds = typeof subcategory.ingredients[0] == 'string' ? subcategory.ingredients : subcategory.ingredients.map((i: Ingredient) => i.id)
    let categoryIds = typeof subcategory.subcategories[0] == 'string' ? subcategory.subcategories : subcategory.subcategories.map((i: Category) => i.id)
    subcategory.ingredients = await this.ingredientsService.find({ $expr: { $in: [{ $toString: '$_id' }, this.ingredientIds] } }, ['-__v'], 0, 24, 'name', ['ingredients']);
    subcategory.subcategories = await this.categoriesService.find({ $expr: { $in: [{ $toString: '$_id' }, categoryIds] } }, ['-__v'], 0, 30, 'name', ['subcategories']);
    // this.toggleCategory(subcategory);
    this.selectedSubCategory = subcategory;
    this.topolino = subcategory;
  }

  async loadMoreIngredients(event: any = null, selectedSubCategory: Category) {
    try {
      selectedSubCategory.ingredients.push(...(await this.ingredientsService.find({ $expr: { $in: [{ $toString: '$_id' }, this.ingredientIds] } }, ['-__v'], this.selectedSubCategory.ingredients.length, 24, 'name', ['ingredients'])));
      // this.selectedSubCategory = [category]
      if (event) event.target.complete();
      return
    }
    catch (error) {
    }
  }

  // async toggleSubCategory(subcategory: Category) {
  //   let ingredientIds = typeof subcategory.ingredients[0] == 'string' ? subcategory.ingredients : subcategory.ingredients.map((i: Ingredient) => i.id)
  //   let categoryIds = typeof subcategory.subcategories[0] == 'string' ? subcategory.subcategories : subcategory.subcategories.map((i: Category) => i.id)
  //   let promises = [
  //     this.ingredientsService.find({ $expr: { $in: [{ $toString: '$_id' }, ingredientIds] } }, ['-__v'], 0, 24, 'name', ['ingredients']),
  //     this.categoriesService.find({ $expr: { $in: [{ $toString: '$_id' }, categoryIds] } }, ['-__v'], 0, 30, 'name', ['subcategories'])
  //   ];
  //   let results = await Promise.all(promises as any[])
  //   subcategory.ingredients = results[0];
  //   subcategory.subcategories = results[1];

  //   this.toggleCategory(subcategory);
  // }


  isCategorySelected(category: Category, includeSubcategories: boolean = false) {
    return !!this.selectedCategories.find(sc => sc.id == category.id);
  }

  isSubCategorySelected(category: Category) {
    return !!this.selectedCategories.find(sc => !!category.subcategories.find(scc => (typeof scc == 'string' ? scc : scc.id) == sc.id));
  }

  async searchIngredients() {
    let filter = { $or: [{ name: { $regex: `.*${this.seach_term}.*`, $options: 'i' } }, { brand: { $regex: `.*${this.seach_term}.*`, $options: 'i' } }] };
    this.ingredients = await this.ingredientsService.find(filter, ['-__v'], 0, 50, '-name')
  }

  getSelf(obj) {
    return obj as any;
  }

  selectChange($event) {
    console.log($event);
    if ($event.detail.value == 'receipt') {
      this.selectedCategories = [];
      this.seach_term = '';
      return;
    }
    this.toggleCategory($event.detail.value)
  }

  positionCart: number = 0;
  @HostListener('wheel', ['$event'])
  onWheelScroll(event: WheelEvent) {
    let cartElement = document.querySelector<HTMLDivElement>('#cart')
    if (this.positionCart == 0) {
      let offsetTop = cartElement.offsetTop;
      this.positionCart = offsetTop;
    }

    let scrollPositionY = event.offsetY;
    console.log("scroll position: " + scrollPositionY)
    if (scrollPositionY > 100) {
        cartElement.style.top = '95px';
    }else {
      cartElement.style.top = this.positionCart + 'px';
    }
  }
}
