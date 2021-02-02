import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { IDynamicFilterBuilder } from '../../core/dynamic-filter.interface';
import { DynamicFormFieldConfig } from '../../core/dynamic-form-field.config';
import { EntityConfig } from '../../core/entity.config';
import { RegisteredFilterBuilders, RegisteredParser } from '../../utils/dynamic-form.utils';

@Component({
  selector: 'dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss'],
})
export class DynamicListComponent implements OnInit {

  @Input("settings") settings: { title?: string, row_length: number, showMoreButton: boolean } = { row_length: 20, showMoreButton: true };
  @Input("config") config: EntityConfig;
  @Input("data") data: any[] = [];
  @Input("extraButtons") extraButtons: { key: string, icon: string }[] = [];

  @Output("add") add: EventEmitter<any> = new EventEmitter<any>();
  @Output("edit") edit: EventEmitter<any> = new EventEmitter<any>();
  @Output("delete") delete: EventEmitter<any> = new EventEmitter<any>();
  @Output("more") more: EventEmitter<any> = new EventEmitter<any>();
  @Output("extraButtonClick") extraButtonClick: EventEmitter<{ key: string, data: any }> = new EventEmitter<{ key: string, data: any }>();
  @Output("filterChange") filterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output("rowLengthChange") rowLengthChange: EventEmitter<any> = new EventEmitter<any>();

  public fields: DynamicFormFieldConfig[] = [];
  public showFilter: boolean = false;
  public filter: any = {};
  public filterBuilder: IDynamicFilterBuilder;


  constructor() {
  }

  ngOnInit() {
    this.fields = this.config.fields.filter(f => !(f.list || {}).hidden);
    this.filterBuilder = RegisteredFilterBuilders.get(this.config.filterBuilder);
    this.filterBuilder.setFields(this.fields);
    this.createFilter();
  }

  createFilter() {
    this.filter = this.filterBuilder.create();
    this.filterChange.emit(this.filter);
  }

  getSearchableFields() {
    return this.fields.filter(f => f.type == 'input' && (f.templateOptions.type == null || f.templateOptions.type == 'text') && (f.list.filterable == null || f.list.filterable))
  }

  getRangeFields() {
    return this.fields.filter(f => f.type == 'input' && (f.templateOptions.type == 'number' || f.templateOptions.type == 'date') && (f.list.filterable == null || f.list.filterable))
  }

  getCheckboxFields() {
    return this.fields.filter(f => f.type == 'checkbox' && (f.list.filterable == null || f.list.filterable))
  }

  getParser(field, value) {
    return field.list.parser(value);
  }
}
