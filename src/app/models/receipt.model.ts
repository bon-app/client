import { DynamicEntity } from '../lib/dynamic-forms/decorators/dynamic-entity.decorator';
import { ReceiptIngredientsMatching } from './receipt-ingredientsMatching.model';

@DynamicEntity()
export class Receipt {
    public id: string;
    public name: string;
    public description?: string;
    public ingredients: { ingredient?: (string | ReceiptIngredientsMatching), qta?: string }[] = [];
    public image_url?: string;
    public kcal: string;
    public time: string;
    public preparing?: string;

    constructor() {
        this.ingredients = [];
    }
}