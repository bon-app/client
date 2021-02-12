import { DatePipe } from "@angular/common";
import { Type } from "@angular/core";
import { DefaultFilterComponent } from "../components/default-filter/default-filter.component";
import { DynamicTableComponent } from "../components/dynamic-table/dynamic-table.component";
import { DynamicFilter } from "../core/dynamic-filter.base";
import { DefaultDynamicFilterBuilder } from "../core/dynamic-filter.filter";
import { IDynamicFilterBuilder } from "../core/dynamic-filter.interface";
import { DynamicList } from "../core/dynamic-list.base";

export class RegisteredParser {

    static pool: { [key: string]: (value: any, ...args: any[]) => any } = {
        'ellips': (value, n = '100') => {
            value = value || '';
            n = parseInt((n || '99999999'));
            let tmp = document.createElement("DIV");
            tmp.innerHTML = value;
            value = tmp.textContent;
            return `${value.substr(0, n - 3 > 0 ? n - 3 : 999)}${value.length > n ? '...' : ''}`
        },
        'date': (value, format = 'yyyy-MM-dd HH:mm') => {
            value = value || '';
            return new DatePipe('en').transform(value, format);
        },
        'count': (value) => `${value.length} elements`,
        'currency': (value, n = '2', symbol = '€') => value ? `${symbol} ${value.toFixed(parseInt((n || '2')))}` : '-',
        'checkbox': (value) => value ? 'Yes' : 'No',
        'image': (value) => `<img src="${value}" style="height: 50px" />`,
    }

    static _default(value) {
        return value
    }

    static register(key: string, parser: (value: any, ...args: any[]) => any) {
        RegisteredParser.pool[key] = parser;
    }

    static get(key: string): (value: any, ...args: any[]) => any {

        let args = []
        if (key.indexOf(':') > -1) {
            args = key.split(/\:(?=(?:[^(\'|\")]*\'[^(\'|\")]*\')*[^(\'|\")]*$)/).map(k => k.replace(/('|")/ig, ''));
            let fn = RegisteredParser.pool[args[0]] || RegisteredParser._default;
            args.shift();
            return (value) => fn.call(fn, value, ...args);
        }

        return RegisteredParser.pool[key] || RegisteredParser._default;
    }

}

export class RegisteredFilterBuilders {

    static pool: { [key: string]: IDynamicFilterBuilder } = {
        'default': new DefaultDynamicFilterBuilder(),
    }

    static _default() {
        return new DefaultDynamicFilterBuilder()
    }

    static register(key: string, builder: IDynamicFilterBuilder) {
        RegisteredFilterBuilders.pool[key] = builder;
    }

    static get(key: string) {

        return RegisteredFilterBuilders.pool[key] || RegisteredFilterBuilders._default();
    }

}

export class RegisteredFilterComponents {

    static pool: { [key: string]: Type<DynamicFilter> } = {
        'default': DefaultFilterComponent,
    }

    static _default(): Type<DynamicFilter> {
        return DefaultFilterComponent
    }

    static register(key: string, type: Type<DynamicFilter>) {
        RegisteredFilterComponents.pool[key] = type;
    }

    static get(key: string) {
        return RegisteredFilterComponents.pool[key] || RegisteredFilterComponents._default();
    }

}

export class RegisteredListComponents {

    static pool: { [key: string]: Type<DynamicList> } = {
        'default': DynamicTableComponent,
    }

    static _default(): Type<DynamicList> {
        return DynamicTableComponent
    }

    static register(key: string, type: Type<DynamicList>) {
        RegisteredListComponents.pool[key] = type;
    }

    static get(key: string) {
        return RegisteredListComponents.pool[key] || RegisteredListComponents._default();
    }

}

export const REGISTER = {
    LIST_COMPONENTS: RegisteredListComponents,
    FILTER_COMPONENTS: RegisteredFilterComponents,
    FILTER_BUILDERS: RegisteredFilterBuilders,
    LIST_PARSERS: RegisteredParser,
}

window["__DYNAMIC_REGISTER"] = REGISTER;