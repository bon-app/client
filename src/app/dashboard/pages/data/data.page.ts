import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Ingredient } from '../../../models/ingredient.model';
import { IngredientsService } from '../../../services/ingredients.service';
import { CategoriesService } from '../../../services/categories.service';
import { ReceiptsService } from '../../../services/receipts.service';
import { Category } from '../../../models/category.model';
import { Receipt } from '../../../models/receipt.model';
import { ReceiptIngredientsMatching } from '../../../models/receipt-ingredientsMatching.model';
import { RimsService } from '../../../services/rims.service';
import { Table, IngredientsTable, CategoriesTable, ReceiptsTable, RimsTable } from './utils/tables';
import { ModalController } from '@ionic/angular';

declare var luckysheet;

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {

  public tables: { [key: string]: Table<any> } = {};
  public ingredients: Ingredient[];
  public categories: Category[];
  public receipts: Receipt[];
  public rims: ReceiptIngredientsMatching[];

  constructor(
    private ingredientsService: IngredientsService,
    private categoriesService: CategoriesService,
    private receiptsService: ReceiptsService,
    private rimsService: RimsService,
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {
    this.tables.ingredients = new IngredientsTable(this.translate);
    this.tables.categories = new CategoriesTable(this.translate, this.modalCtrl);
    this.tables.receipts = new ReceiptsTable(this.translate, this.modalCtrl);
    this.tables.rims = new RimsTable(this.translate, this.modalCtrl);

    window['all_changes'] = () => {
      console.log('INGREDIENTS', this.tables.ingredients.changes.items)
      console.log('CATEGORIES', this.tables.categories.changes.items)
      console.log('RECEIPTS', this.tables.receipts.changes.items)
      console.log('RIMS', this.tables.rims.changes.items)
    }
  }

  async ngOnInit() {

    this.ingredients = await this.ingredientsService.find({}, ['-__v'], 0, 5000, { name: 1 });
    this.categories = await this.categoriesService.find({}, ['-__v'], 0, 5000, { name: 1 });
    this.receipts = await this.receiptsService.find({}, ['-__v'], 0, 5000, { name: 1 }, ['ingredients.ingredient']);
    this.rims = await this.rimsService.find({}, ['-__v'], 0, 5000, { name: 1 }, ['ingredients.ingredient']);

    var options = {
      title: "Dati",
      showtoolbar: false,
      container: 'luckysheet', //luckysheet is the container id
      hook: {
        cellUpdated: (row: number, col: number, previous: any, updated, isRefresh: boolean) => {
          let sheet = luckysheet.getSheet();
          sheet.name = ("" + sheet.name).toLowerCase();
          let change = { obj_id: luckysheet.getCellValue(row, 0), row, col, previous, updated, isRefresh, sheet };
          if (updated) {
            let el = this.tables[sheet.name].changes.items.find(x => x.id == change.obj_id);
            if (!el) {
              el = { id: change.obj_id };
              this.tables[sheet.name].changes.items.push(el);
            }
            el[this.tables[sheet.name].changes.keys[col]] = updated.v;
          }
        },
        updated: (operate) => {
          if (operate.type == "updateDataVerificationOfCheckbox") {
            let sheet = luckysheet.getSheet();
            sheet.name = ("" + sheet.name).toLowerCase();
            for (let k in operate.currentDataVerification) {
              if (operate.currentDataVerification[k].checked != (operate.historyDataVerification[k] ? operate.historyDataVerification[k].checked : null)) {
                let col = operate.range.column[0];
                let row = operate.range.row[0];
                let obj_id = luckysheet.getCellValue(row, 0);
                let el = this.tables[sheet.name].changes.items.find(x => x.id == obj_id);
                if (!el) {
                  el = { id: obj_id };
                  this.tables[sheet.name].changes.items.push(el);
                }
                el[this.tables[sheet.name].changes.keys[col]] = operate.currentDataVerification[k].checked;
              }
            }
          }
        },
        cellMousedown: (cell, position, sheetFile, ctx) => {
          let sheet = luckysheet.getSheet();
          let sheet_key = ("" + sheet.name).toLowerCase();
          this.tables[sheet_key].handleCellClick(sheet.name, position.r, position.c);
        },
      },
      data: [
        this.tables.ingredients.createSheet('Ingredients', this.ingredients),
        this.tables.rims.createSheet('RIMs', this.rims),
        this.tables.categories.createSheet('Categories', this.categories),
        this.tables.receipts.createSheet('Receipts', this.receipts),
      ]
    }
    luckysheet.create(options);
  }

  addLine() {
    let wrapper = this.tables[('' + luckysheet.getSheet().name).toLowerCase()];
    let d = wrapper.addNewRow(luckysheet.getSheet().data.length, wrapper.changes.keys, null);
    for (let dt of d.data) {
      luckysheet.setCellValue(dt.r, dt.c, dt.v)
    }
    // ingredientsData.push(...d.data)
    // Object.assign(validation, d.v);
    luckysheet.jfrefreshgrid();
    for (let k in d.v) {
      let row = parseInt(k.split('_')[0]);
      let col = parseInt(k.split('_')[1]);
      luckysheet.setDataVerification(d.v[k], { range: { row: [row, row], column: [col, col] } })
    }
    luckysheet.jfrefreshgrid();

  }

}
