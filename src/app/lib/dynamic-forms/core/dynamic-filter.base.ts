import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IDynamicFilterBuilder } from "./dynamic-filter.interface";
import { DynamicFormFieldConfig, FilterTypes } from "./dynamic-form-field.config";

@Component({
  template: ''
})
export abstract class DynamicFilter {

  @Input() filterBuilder: IDynamicFilterBuilder;
  @Input() fields: DynamicFormFieldConfig[] = [];
  @Input("settings") settings: { title?: string, row_length: number, showMoreButton: boolean } = { row_length: 20, showMoreButton: true };

  @Output("rowLengthChange") rowLengthChange: EventEmitter<any> = new EventEmitter<any>();
  @Output("filterChange") filterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  getSearchableFields() {
    return this.fields.filter(f => (f.list.filterable || f.list.filterable == null) && f.list.filter_type == FilterTypes.TEXT)
  }

  getRangeFields() {
    return this.fields.filter(f => (f.list.filterable || f.list.filterable == null) && (f.list.filter_type == FilterTypes.RANGE || f.list.filter_type == FilterTypes.RANGE_DATETIME))
  }

  getCheckboxFields() {
    return this.fields.filter(f => (f.list.filterable || f.list.filterable == null) && f.list.filter_type == FilterTypes.CHECKBOX)
  }

}