import { EventEmitter, Input, Output } from "@angular/core";
import { DynamicFormFieldConfig } from "./dynamic-form-field.config";
import { EntityConfig } from "./entity.config";
export abstract class DynamicList {

  @Input("config") config: EntityConfig;
  @Input("data") data: any[] = [];
  @Input("settings") settings: { title?: string, row_length: number, showMoreButton: boolean } = { row_length: 20, showMoreButton: true };
  @Input("fields") fields: DynamicFormFieldConfig[] = [];
  @Output("extraButtonClick") extraButtonClick: EventEmitter<{ key: string, data: any }> = new EventEmitter<{ key: string, data: any }>();
  @Output("edit") edit: EventEmitter<any> = new EventEmitter<any>();
  @Output("delete") delete: EventEmitter<any> = new EventEmitter<any>();
  @Output("more") more: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  getParser(field, value) {
    return field.list.parser(value);
  }

}