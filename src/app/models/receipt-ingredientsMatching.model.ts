import { DynamicEntity } from '../lib/dynamic-forms/decorators/dynamic-entity.decorator';
import { Ingredient } from './ingredient.model';

@DynamicEntity()
export class ReceiptIngredientsMatching {
    public id: string;
    public matchingName: string;
    public ingredients: { ingredient?: (string | Ingredient), priority?: number }[] = [];
    public icon_url?: string;
    public name: string;
    public isCondiment: boolean;

    constructor() {
        this.ingredients = [];
    }
}