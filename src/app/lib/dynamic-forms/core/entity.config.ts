
import { DynamicFormFieldConfig } from './dynamic-form-field.config';

function getPathValue(value: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], value);
}

function setPathValue(value: any, path: string, nextValue: any): void {
    const keys = path.split('.');
    const finalKey = keys.pop();
    const target = keys.reduce((current, key) => current[key] ??= {}, value);
    if (finalKey !== undefined) target[finalKey] = nextValue;
}

export class EntityConfig {
    key: string;
    title: string;
    fields: DynamicFormFieldConfig[];
    crudOptions: { [key: string]: { fields?: string[], orderBy?: any, includes?: string[] } };
    filterBuilder?: string;
    filterComponent?: string;
    listComponent?: string;
    listOptions: EntityListOptions = new EntityListOptions();
    relations: EntityRelation[] = [];
    service: string;
    object: string;

    validateModel(model) {
        for (let relation of this.relations) {
            if (relation.type == 'many') {
                if (!Array.isArray(model[relation.field])) {
                    throw new Error(`The relation ${this.object}#${relation.field}_${relation.fk_field} need an Array!`);
                }
                model[relation.field] = model[relation.field].map(el => relation.resolve(el));
                continue;
            }

            if (relation.type == 'one') {
                if (Array.isArray(model[relation.field])) {
                    throw new Error(`The relation ${this.object}#${relation.field}_${relation.fk_field} need an Object!`);
                }
                model[relation.field] = relation.resolve(model[relation.field]);
            }

            return model;
        }

        return model;
    }

    static fromJson(json: any) {
        let config = new EntityConfig();
        config.key = json.key;
        config.title = json.title;
        config.service = json.service;
        config.object = json.object;
        config.crudOptions = json.crudOptions;
        config.listOptions = EntityListOptions.fromJson(json.listOptions);
        let fields = [];
        for (let field of (json.fields || [])) {
            fields.push(DynamicFormFieldConfig.fromJson(field));
        }
        config.fields = fields;
        let relations = [];
        for (let relation of (json.relations || [])) {
            relations.push(EntityRelation.fromJson(relation));
        }
        config.relations = relations;
        return config;
    }
}


export class EntityRelation {
    type: 'many' | 'manyObject' | 'one' | 'oneObject';
    field: string;
    fk_field?: string;
    pk_field: string;

    resolve(data: any) {
        if (this.fk_field) {
            setPathValue(data, this.fk_field, getPathValue(data, this.pk_field));
            return data;
        }

        if (typeof data != 'string') {
            data = getPathValue(data, this.pk_field);
        }
        
        return data;
    }

    static fromJson(json: string) {
        let relation = new EntityRelation();
        Object.assign(relation, json);
        return relation;
    }
}

export class EntityListOptions {
    public extraButtons: { key: string, icon: string }[] = [];
    public rows: { extraButtons?: { key: string, icon: string }[] } = { extraButtons: [] }
    public actions: { edit: boolean, remove: boolean, [key: string]: boolean } = { edit: true, remove: true };

    static fromJson(json: any) {
        let options: EntityListOptions = new EntityListOptions();
        if (json) {
            options.extraButtons = json.extraButtons || [];
            options.actions = { edit: true, remove: true };
            options.rows = json.rows || { extraButtons: [] };
            Object.assign(options.actions, json.json || {});
        }
        return options;
    }
}

