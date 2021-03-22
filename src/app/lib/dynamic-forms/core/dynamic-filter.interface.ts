import { DynamicFormFieldConfig } from "./dynamic-form-field.config";


export interface IDynamicFilterBuilder {
    term: string;
    searchable: { [key: string]: any };
    ranges: { [key: string]: any };
    checked: { [key: string]: any };

    setFields(fields: DynamicFormFieldConfig[]);
    create(): any;
}