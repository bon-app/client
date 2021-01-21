import { ExcelField } from "./field";

export class ExcelSheet {
    public type: string;
    public name: string;
    public label: string;
    public config: any;
    public fields: ExcelField[] = [];

    constructor(options: ExcelSheet = null) {
        this.fields = [];
        if (options) {
            this.type = options.type;
            this.name = options.name;
            this.label = options.label || this.name;
            this.config = options.config;
            this.fields = options.fields || [];
        }
    }
}