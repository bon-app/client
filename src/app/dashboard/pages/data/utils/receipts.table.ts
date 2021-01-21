import { ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { IngredientsReceiptsComponent } from "../../../../components/ingredients-receipts/ingredients-receipts.component";
import { ReceiptIngredientsMatching } from "../../../../models/receipt-ingredientsMatching.model";
import { Receipt } from "../../../../models/receipt.model";
import { Table } from "./tables";

declare var luckysheet;

export class ReceiptsTable implements Table<Receipt> {

    public sheetName: string;
    public changes: { keys: string[]; items: Receipt[]; } = { keys: ['id', 'name', 'description', 'kcal', 'preparing', 'time', 'image_url', 'ingredients'], items: [] };
    public all: Receipt[] = [];

    constructor(private translate: TranslateService, public modalCtrl: ModalController) {
    }

    handleCellClick(sheet: string, row: number, column: number, ...args: any[]) {
        if (('' + sheet).toLowerCase() == ('' + this.sheetName).toLowerCase()) {
            if (column == 7) {
                console.log('Open dialog for ' + this.changes.keys[column])
                this.openIngredientsReceipt(this.all.find(a => a.id == luckysheet.getCellValue(row, 0)));

            }
        }
    }

    parseData(data: Receipt[]) {
        // data = JSON.parse(JSON.stringify(data));
        let _data = [];
        let validation = {};

        for (let i = 0; i < this.changes.keys.length; i++) {
            let d = { r: 0, c: i, v: { ct: { fa: "General", t: "g" }, bl: 1, v: this.translate.instant("DB.Receipts." + this.changes.keys[i]) } };
            _data.push(d)
        }

        for (let i = 0; i < data.length; i++) {
            let ingredient = data[i];
            let d = this.addNewRow(i + 1, this.changes.keys, ingredient);
            _data.push(...d.data)
            Object.assign(validation, d.v);
        }

        // let d = this.addNewRow(data.length + 1, this.changes.keys);
        // _data.push(...d.data)
        // Object.assign(validation, d.v);

        return { data: _data, validation };
    }

    addNewRow(row: number, keys: string[], entity: Receipt = null) {
        if (!entity) {
            try {
                luckysheet.insertRow(luckysheet.getSheet().data.length);
            } catch (error) {
            }
            entity = new Receipt();
            entity.id = 'new__' + Date.now();
        }

        let validation = {};
        let data = []
        for (let j = 0; j < keys.length; j++) {
            let d = { r: row, c: j, v: null };
            switch (keys[j]) {
                case 'ingredients':
                    d.v = {
                        ct: { fa: "General", t: "g" },
                        v: `${entity[keys[j]].length} ingredienti`,
                        m: `${entity[keys[j]].length} ingredienti`
                        // v: `edit`,
                        // m: `edit`,
                    };
                    break;
                default:
                    d.v = { ct: { fa: "General", t: "g" }, v: entity[keys[j]] };
                    break;
            }
            data.push(d);
        }
        return { data, v: validation };
    }

    createSheet(sheetName: string, entities: Receipt[]) {
        this.sheetName = sheetName || this.sheetName;
        let data = this.parseData(entities);
        return {
            name: sheetName,
            color: "",
            status: "1",
            column: this.changes.keys.length,
            row: entities.length,
            order: "0",
            defaultRowHeight: 25, //Customized default row height
            defaultColWidth: 200,
            celldata: data.data,
            dataVerification: data.validation,
            config: {
                merge: {}, //Merged cells
                rowlen: {}, //Table row height
                columnlen: {}, //Table column width
                rowhidden: {}, //Hidden rows
                colhidden: { "0": 0 }, //Hidden columns
                borderInfo: {}, //Borders
                authority: {
                    deleteColumns: 1,
                    insertColumns: 1,
                    formatCells: 1, //Format cells
                    formatColumns: 1, //Format columns
                    formatRows: 1,
                }, //Worksheet protection
            }
        }
    }

    private async openIngredientsReceipt(rim: Receipt) {
        if (!rim) {
            console.log("ERROR RIM NOT FOUND");
            return;
            luckysheet.insertRow(luckysheet.getSheet().data.length);

        }
        let modal = await this.modalCtrl.create({
            component: IngredientsReceiptsComponent,
            componentProps: {
                items: rim.ingredients
            },
            backdropDismiss: false,
            swipeToClose: false,
            cssClass: ['auto-height']
        });

        modal.present();

        modal.onDidDismiss().then((res: { data: { qta: string, ingredient: ReceiptIngredientsMatching }[] }) => {
            if (res.data) {
                let ingredients = res.data.map(d => { return { qta: d.qta, ingredient: (d.ingredient.id || (d.ingredient as any)._id) } });
                let rim1 = this.changes.items.find(i => i.id == rim.id);
                if (rim1) {
                    rim1.ingredients = ingredients;
                } else {
                    this.changes.items.push({ id: rim.id, ingredients } as Receipt);
                }
                rim.ingredients = res.data;
            }
        })
    }
}
