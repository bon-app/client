import { DynamicEntity } from "../lib/dynamic-forms/decorators/dynamic-entity.decorator";

@DynamicEntity()
export class Ingredient {
    public id: string;
    public name: string;
    public description?: string;
    public brand: string;
    public qty: string;
    public price: number;
    public active: boolean;
    public icon_url?: string;
}