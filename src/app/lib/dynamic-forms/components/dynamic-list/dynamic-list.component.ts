import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Type, ViewChild } from '@angular/core';
import { DynamicFactory } from '../../core/dynamic-factory';
import { IDynamicFilterBuilder } from '../../core/dynamic-filter.interface';
import { DynamicFormFieldConfig } from '../../core/dynamic-form-field.config';
import { EntityConfig } from '../../core/entity.config';
import { REGISTER } from '../../utils/dynamic-form.utils';

@Component({
  selector: 'dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss'],
})
export class DynamicListComponent implements OnInit, OnChanges {

  @ViewChild('filterComp') filterComp: DynamicFactory;
  @ViewChild('list') list: DynamicFactory;

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
  public showFilter: boolean = true;
  public filter: any = {};
  public filterBuilder: IDynamicFilterBuilder;
  public filterComponent: {
    type?: Type<any>,
    props?: {
      filterBuilder: IDynamicFilterBuilder,
      fields: DynamicFormFieldConfig[],
      settings: {
        title?: string,
        row_length: number,
        showMoreButton: boolean
      }
    }
  } = {};
  public listComponent: {
    type?: Type<any>, props?: {
      config: EntityConfig,
      data: any[],
      settings: { title?: string, row_length: number, showMoreButton: boolean },
      fields: DynamicFormFieldConfig[];
    }
  } = {};


  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.listComponent.props) {
      this.listComponent.props.data = this.data;
      if (this.list) {
        this.list.updateProps({ data: this.data });
      }
    }
  }

  ngOnInit() {
    this.fields = this.config.fields.filter(f => !(f.list || {}).hidden);
    this.filterBuilder = REGISTER.FILTER_BUILDERS.get(this.config.filterBuilder);
    this.filterBuilder.setFields(this.fields);
    this.filterComponent.type = REGISTER.FILTER_COMPONENTS.get(this.config.filterComponent);
    this.filterComponent.props = {
      fields: this.fields,
      filterBuilder: this.filterBuilder,
      settings: this.settings
    }
    this.createFilter();

    this.listComponent.type = REGISTER.LIST_COMPONENTS.get(this.config.listComponent)
    this.listComponent.props = {
      config: this.config,
      data: this.data,
      fields: this.fields,
      settings: this.settings
    }
    if ((this.settings?.title || this.config.title) == 'Gestione ricette') {this.showFilter = false};
  }

  createFilter() {
    this.filter = this.filterBuilder.create();
    this.filterChange.emit(this.filter);
  }

  handleListEvent(result: { key: string, $event: any }) {
    switch (result.key) {
      case 'edit':
        this.edit.emit(result.$event)
        break;

      case 'more':
        this.more.emit(result.$event)
        break;

      case 'extraButtonClick':
        this.extraButtonClick.emit(result.$event)
        break;

      case 'delete':
        this.delete.emit(result.$event)
        break;

      default:
        break;
    }
  }


  handleFilterEvent(result: { key: string, $event: any }) {
    switch (result.key) {
      case 'rowLengthChange':
        this.rowLengthChange.emit(this.settings.row_length)
        break;

      case 'filterChange':
        this.createFilter();
        break;
      default:
        break;
    }
  }

  printConsole(result: { key: string, $event: any }) {
    debugger
    console.log(result);
  }

}
