import { Ingredient } from './ingredient.model';

export class ReceiptIngredientsMatching {
    public id: string;
    public matchingName: string;
    public ingredients: { ingredient?: (string | Ingredient), priority?: number }[] = [];
    public icon_url?: string;
    public name: string;
    public isCondiment: boolean;
}