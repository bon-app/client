export class Order {
    public id: string;
    public created: Date = new Date();
    public modified: Date = new Date();
    public info: any[] = [];
    public shipping_cost: number;
    public fk_user: (string | any);
    public delivery_method: string;
    public delivery_time: string;
    public address: { street?: string, street_number?: string, city?: string, prov?: string, state?: string, [key: string]: any };
    public name: string;
    public phone: string;
    public status: string;
}