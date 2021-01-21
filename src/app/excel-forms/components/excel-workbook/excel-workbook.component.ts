import { Component, Input, OnInit } from '@angular/core';
import { ExcelSheet } from '../../models/sheet';
import { ExcelWorkbook } from '../../models/workbook';

declare var luckysheet;

@Component({
  selector: 'excel-workbook',
  templateUrl: './excel-workbook.component.html',
  styleUrls: ['./excel-workbook.component.scss'],
})
export class ExcelWorkbookComponent implements OnInit {

  @Input("workbook") workbook: ExcelWorkbook;

  public options: any = {};

  constructor() { }

  ngOnInit() {
    this.options = {
      title: this.workbook.title,
      showtoolbar: this.workbook.options.showtoolbar,
      container: 'luckysheet', //luckysheet is the container id
      hook: {
        // cellUpdated: (row: number, col: number, previous: any, updated, isRefresh: boolean) => {
        //   let sheet = luckysheet.getSheet();
        //   sheet.name = ("" + sheet.name).toLowerCase();
        //   let change = { obj_id: luckysheet.getCellValue(row, 0), row, col, previous, updated, isRefresh, sheet };
        //   if (updated) {
        //     let el = this.tables[sheet.name].changes.items.find(x => x.id == change.obj_id);
        //     if (!el) {
        //       el = { id: change.obj_id };
        //       this.tables[sheet.name].changes.items.push(el);
        //     }
        //     el[this.tables[sheet.name].changes.keys[col]] = updated.v;
        //   }
        // },
        // updated: (operate) => {
        //   if (operate.type == "updateDataVerificationOfCheckbox") {
        //     let sheet = luckysheet.getSheet();
        //     sheet.name = ("" + sheet.name).toLowerCase();
        //     for (let k in operate.currentDataVerification) {
        //       if (operate.currentDataVerification[k].checked != (operate.historyDataVerification[k] ? operate.historyDataVerification[k].checked : null)) {
        //         let col = operate.range.column[0];
        //         let row = operate.range.row[0];
        //         let obj_id = luckysheet.getCellValue(row, 0);
        //         let el = this.tables[sheet.name].changes.items.find(x => x.id == obj_id);
        //         if (!el) {
        //           el = { id: obj_id };
        //           this.tables[sheet.name].changes.items.push(el);
        //         }
        //         el[this.tables[sheet.name].changes.keys[col]] = operate.currentDataVerification[k].checked;
        //       }
        //     }
        //   }
        // },
        // cellMousedown: (cell, position, sheetFile, ctx) => {
        //   let sheet = luckysheet.getSheet();
        //   let sheet_key = ("" + sheet.name).toLowerCase();
        //   this.tables[sheet_key].handleCellClick(sheet.name, position.r, position.c);
        // },
      },
      data: this.workbook.sheets.map(s => this.createSheet(s))
    }
    luckysheet.create(this.options);
  }

  createSheet(sheet: ExcelSheet) {
    return {
      name: sheet.label,
      color: "",
      status: "1",
      column: sheet.fields.length,
      //TODO: implementare il 2-way binding
      // row: entities.length,
      order: "0",
      defaultRowHeight: 25, //Customized default row height
      defaultColWidth: 200,
      //TODO: implementare il 2-way binding
      // celldata: data.data,
      dataVerification: data.validation,
      config: sheet.config
      // {
      //   merge: {}, //Merged cells
      //   rowlen: {}, //Table row height
      //   columnlen: {}, //Table column width
      //   rowhidden: {}, //Hidden rows
      //   colhidden: { "0": 0 }, //Hidden columns
      //   borderInfo: {}, //Borders
      //   authority: {
      //     deleteColumns: 1,
      //     insertColumns: 1,
      //     formatCells: 1, //Format cells
      //     formatColumns: 1, //Format columns
      //     formatRows: 1,
      //   }, //Worksheet protection
      // }
    }
  }

}
