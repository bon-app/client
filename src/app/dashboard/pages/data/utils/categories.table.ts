import { ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { IngredientsComponent } from "../../../../components/ingredients/ingredients.component";
import { Category } from "../../../../models/category.model";
import { Ingredient } from "../../../../models/ingredient.model";
import { Table } from "./tables";

declare var luckysheet;

export class CategoriesTable implements Table<Category> {

    public sheetName: string;
    public changes: { keys: string[]; items: Category[]; } = { keys: ['id', 'name', 'ingredients', 'subcategories'], items: [] };

    public all: Category[] = [];

    constructor(private translate: TranslateService, public modalCtrl: ModalController) {
    }

    handleCellClick(sheet: string, row: number, column: number, ...args: any[]) {
        if (('' + sheet).toLowerCase() == ('' + this.sheetName).toLowerCase()) {
            if (column == 2) {
                console.log('Open dialog for ' + this.changes.keys[column]);

                this.openIngredients(this.all.find(a => a.id == luckysheet.getCellValue(row, 0)), row);
            }
            if (column == 3) {
                console.log('Open dialog for ' + this.changes.keys[column])
            }
        }
    }

    parseData(data: Category[]) {
        this.all = data;
        // data = JSON.parse(JSON.stringify(data));

        let _data = [];
        let validation = {};

        for (let i = 0; i < this.changes.keys.length; i++) {
            let d = { r: 0, c: i, v: { ct: { fa: "General", t: "g" }, bl: 1, v: this.translate.instant("DB.Categories." + this.changes.keys[i]) } };
            _data.push(d)
        }

        for (let i = 0; i < data.length; i++) {
            let entity = data[i];
            let d = this.addNewRow(i + 1, this.changes.keys, entity);
            _data.push(...d.data)
            Object.assign(validation, d.v);
        }

        // let d = this.addNewRow(data.length + 1, this.changes.keys);
        // _data.push(...d.data)
        // Object.assign(validation, d.v);

        return { data: _data, validation };
    }

    addNewRow(row: number, keys: string[], entity: Category = null) {
        if (!entity) {
            try {
                luckysheet.insertRow(luckysheet.getSheet().data.length);
            } catch (error) {
            }
            entity = new Category();
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
                        v: `${entity[keys[j]].length} prodotti`,
                        m: `${entity[keys[j]].length} prodotti`
                        // v: `edit`,
                        // m: `edit`,
                    };
                    break;
                case 'subcategories':
                    d.v = {
                        ct: { fa: "General", t: "g" },
                        v: `${entity[keys[j]].length} sottocategorie`,
                        m: `${entity[keys[j]].length} sottocategorie`
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

    createSheet(sheetName: string, entities: Category[]) {
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

    private async openIngredients(category: Category, row: number) {
        if (!category) {
            category = new Category();
            category.id = luckysheet.getCellValue(row, 0);
            console.log("NEW CATEGORY", category);
            this.all.push(category);
        }
        let modal = await this.modalCtrl.create({
            component: IngredientsComponent,
            componentProps: {
                items: category.ingredients
            },
            backdropDismiss: false,
            swipeToClose: false,
            cssClass: ['auto-height']
        });

        modal.present();

        modal.onDidDismiss().then((res: { data: Ingredient[] }) => {
            if (res.data) {
                let _category: Category = this.changes.items.find(i => i.id == category.id);
                if (_category) {
                    _category.ingredients = res.data.map(c => c.id);
                } else {
                    this.changes.items.push({ id: category.id, ingredients: res.data.map(c => c.id) } as Category);
                }
                category.ingredients = res.data;
            }
        })
    }
}