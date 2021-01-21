export class ExcelField {
    public key: string;
    public label: string;
    public type: string;
    public order: number;

    constructor(options: ExcelField = null) {
        if (options) {
            this.key = options.key;
            this.label = options.label || options.key;
            this.type = options.type;
            this.order = options.order;
        }

    }
}