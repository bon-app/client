import { IDynamicFilterBuilder } from "./dynamic-filter.interface";
import { DynamicFormFieldConfig } from "./dynamic-form-field.config";


export class DefaultDynamicFilterBuilder implements IDynamicFilterBuilder {

    public term: string = '';
    public searchable: { [key: string]: boolean } = {}
    public ranges: { [key: string]: { from: number, to: number } } = {};
    public checked: { [key: string]: { active: boolean, value } } = {};

    setFields(fields: DynamicFormFieldConfig[]) {
        /** Filter searchable fields */
        let searchables = fields.filter(f => (f.type == 'input' || f.type == 'html-editor') && (f.templateOptions.type == null || f.templateOptions.type == 'text' || f.templateOptions.type == 'textarea') && (f.list.filterable == null || f.list.filterable))
        for (let f of searchables) {
            this.searchable[f.key as string] = true;
        }
        /** Filter rangeable fields */
        let rangebles = fields.filter(f => f.type == 'input' && (f.templateOptions.type == 'number' || f.templateOptions.type == 'date') && (f.list.filterable == null || f.list.filterable))
        for (let f of rangebles) {
            this.ranges[f.key as string] = { from: null, to: null };
        }
        /** Filter check fields */
        let checks = fields.filter(f => f.type == 'checkbox' && (f.list.filterable == null || f.list.filterable));
        for (let f of checks) {
            this.checked[f.key as string] = { active: false, value: null };
        }
    }

    create() {
        let filter = { $and: [] };

        let searchable_filter = { $or: [] }
        let isPopulate = false;
        for (let key in this.searchable) {
            if (this.searchable[key]) {
                let f = {};
                f[key] = { $regex: `.*${this.term}.*`, $options: 'i' };
                searchable_filter.$or.push(f);
                isPopulate = true;
            }
        }
        if (isPopulate) {
            filter.$and.push(searchable_filter);
        }
        for (let key in this.ranges) {
            if ((!isNaN(this.ranges[key].from) || !isNaN(this.ranges[key].to)) && (this.ranges[key].from != null || this.ranges[key].to != null)) {

                let f = {};
                f[key] = {}
                if (!isNaN(this.ranges[key].from) && this.ranges[key].from != null) {
                    f[key].$gt = this.ranges[key].from
                }
                if (!isNaN(this.ranges[key].to) && this.ranges[key].to != null) {
                    f[key].$lt = this.ranges[key].to
                }
                filter.$and.push(f);
            }
        }

        for (let key in this.checked) {
            if (this.checked[key] && this.checked[key].active) {
                let f = {};
                f[key] = this.checked[key].value ? !!this.checked[key].value : { $ne: true };
                filter.$and.push(f);
            }
        }
        console.log(filter)
        return filter.$and.length ? filter : {};
    }
}
