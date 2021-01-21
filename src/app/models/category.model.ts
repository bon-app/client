import { Ingredient } from './ingredient.model';

export class Category {
    public id: string;
    public name: string;
    public ingredients: (string | Ingredient)[] = [];
    public subcategories?: (string | Category)[] = [];
}