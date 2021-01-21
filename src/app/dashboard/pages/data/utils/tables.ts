export interface Table<T> {
    all: T[];
    sheetName: string;
    changes: { keys: string[], items: T[] }
    parseData(data: T[]);
    addNewRow(row: number, keys: string[], entity: T): any;
    createSheet(sheetName: string, entities: T[]): any;
    handleCellClick(sheet: string, row: number, column: number, ...args: any[])
}

export { CategoriesTable } from "./categories.table";
export { IngredientsTable } from "./ingredients.table";
export { ReceiptsTable } from "./receipts.table";
export { RimsTable } from "./rims.table";
