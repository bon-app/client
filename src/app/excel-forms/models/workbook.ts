import { ExcelSheet } from "./sheet";

export class ExcelWorkbook {

    public title: string;
    public sheets: ExcelSheet[] = [];
    public options: { showtoolbar: boolean } = { showtoolbar: true }

    constructor(options: ExcelWorkbook = null) {
        this.sheets = [];
        if (options) {
            this.title = options.title;
            this.sheets = options.sheets || [];
        }
    }

}