import { TranslateService } from "@ngx-translate/core";
import { Ingredient } from "../../../../models/ingredient.model";
import { Table } from "./tables";

declare var luckysheet;

export class IngredientsTable implements Table<Ingredient>  {

    public sheetName: string;
    public all: Ingredient[] = [];
    public changes: { keys: string[], items: Ingredient[] } = {
        items: [],
        keys: ['id', 'name', 'brand', 'price', 'icon_url', 'active']
    }

    constructor(private translate: TranslateService) {

    }

    handleCellClick(sheet: string, row: number, column: number, ...args: any[]) {

    }

    parseData(data: Ingredient[]) {
        // data = JSON.parse(JSON.stringify(data));
        this.all = data;
        let ingredientsData = [];
        let validation = {};

        for (let i = 0; i < this.changes.keys.length; i++) {
            let d = { r: 0, c: i, v: { ct: { fa: "General", t: "g" }, bl: 1, v: this.translate.instant("DB.Ingredients." + this.changes.keys[i]) } };
            ingredientsData.push(d)
        }

        for (let i = 0; i < data.length; i++) {
            let ingredient = data[i];
            let d = this.addNewRow(i + 1, this.changes.keys, ingredient);
            ingredientsData.push(...d.data)
            Object.assign(validation, d.v);
        }

        // let d = this.addNewRow(data.length + 1, this.changes.keys);
        // ingredientsData.push(...d.data)
        // Object.assign(validation, d.v);

        return { data: ingredientsData, validation };
    }

    addNewRow(row: number, keys: string[], ingredient: Ingredient = null) {
        if (!ingredient) {
            try {
                luckysheet.insertRow(luckysheet.getSheet().data.length);
            } catch (error) {
            }
            ingredient = new Ingredient();
            ingredient.id = 'new__' + Date.now();
        }

        let validation = {};
        let data = []
        for (let j = 0; j < keys.length; j++) {
            let d = { r: row, c: j, v: null };
            switch (keys[j]) {
                case 'price':
                    d.v = { ct: { fa: "0.00", t: "n" }, v: ingredient[keys[j]] };
                    break;

                case 'active':
                    d.v = { ct: { fa: "General", t: "g" }, m: ingredient[keys[j]] ? "Attivo" : "Non attivo", v: ingredient[keys[j]] ? "Attivo" : "Non attivo" }

                    validation[`${row}_${j}`] = {
                        checked: ingredient[keys[j]],
                        hintShow: false,
                        hintText: "",
                        prohibitInput: false,
                        remote: false,
                        type: "checkbox",
                        type2: null,
                        value1: "Attivo",
                        value2: "Non attivo",
                    };
                    break;

                default:
                    d.v = { ct: { fa: "General", t: "g" }, v: ingredient[keys[j]] };
                    break;
            }
            data.push(d);
        }
        return { data, v: validation }
    }

    createSheet(sheetName: string, ingredients: Ingredient[]) {
        this.sheetName = sheetName || this.sheetName;
        let ingredientsData = this.parseData(ingredients);
        return {
            name: sheetName,
            color: "",
            status: "1",
            column: this.changes.keys.length,
            row: ingredients.length,
            order: "0",
            defaultRowHeight: 25, //Customized default row height
            defaultColWidth: 200,
            celldata: ingredientsData.data,
            dataVerification: ingredientsData.validation,
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
}
