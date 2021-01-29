import { DynamicEntity } from '../lib/dynamic-forms/decorators/dynamic-entity.decorator';
import { Ingredient } from './ingredient.model';

@DynamicEntity()
export class Category {
    public id: string;
    public name: string;
    public identifier: string;
    public image_url: string;
    public ingredients: (string | Ingredient)[] = [];
    public subcategories?: (string | Category)[] = [];
    public showBeforeCheckout: boolean;

    constructor() {
        this.ingredients = [];
        this.subcategories = [];
        this.showBeforeCheckout = false;
    }
}