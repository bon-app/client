import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { JoditAngularModule } from 'jodit-angular';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { DefaultFilterComponent } from './components/default-filter/default-filter.component';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { DynamicFactory } from './core/dynamic-factory';
import { DynamicFormsModuleConfig } from './core/dynamic-forms-module.config';
import { DynamicDirective } from './core/dynamic.directive';
import { ENTITIES_CONFIG_MAPPER, ENTITIES_MAPPER, SERVICES_MAPPER } from './core/mapper';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicLabelComponent } from './components/dynamic-form-custom-template/dynamic-label/dynamic-label.component';
import { DynamicManyRelationComponent } from './components/dynamic-form-custom-template/dynamic-many-relation/dynamic-many-relation.component';
import { DynamicOneRelationComponent } from './components/dynamic-form-custom-template/dynamic-one-relation/dynamic-one-relation.component';
import { HtmlEditorComponent } from './components/dynamic-form-custom-template/html-editor/html-editor.component';
import { ManyRelationComponent } from './components/dynamic-form-custom-template/many-relation/many-relation.component';
import { OneRelationComponent } from './components/dynamic-form-custom-template/one-relation/one-relation.component';
import { UploadImagePreviewComponent } from './components/dynamic-form-custom-template/upload-image-preview/upload-image-preview.component';
import { DynamicListComponent } from './components/dynamic-list/dynamic-list.component';



const components = [
  DynamicFormComponent,
  HtmlEditorComponent,
  DynamicListComponent,
  DynamicManyRelationComponent,
  SafeHtmlPipe,
  ManyRelationComponent,
  OneRelationComponent,
  UploadImagePreviewComponent,
  DynamicOneRelationComponent,
  DynamicLabelComponent,
  DefaultFilterComponent,
  DynamicFactory,
  DynamicDirective,
  DynamicTableComponent
];

@NgModule({
  declarations: components,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    FormlyModule.forChild({
      types: [
        { name: 'label', component: DynamicLabelComponent },
        { name: 'html-editor', component: HtmlEditorComponent },
        { name: 'image-preview', component: UploadImagePreviewComponent },
        { name: 'many', component: ManyRelationComponent },
        { name: 'one', component: OneRelationComponent },
      ]
    }),
    FormlyIonicModule,
    AutoCompleteModule,
    TranslateModule.forChild(),
    JoditAngularModule
  ],
  exports: components
})
export class DynamicFormsModule {

  static forRoot(config: DynamicFormsModuleConfig = null): ModuleWithProviders<DynamicFormsModule> {

    config = config || new DynamicFormsModuleConfig();

    for (let e of (config.entitiesConfig || [])) {
      ENTITIES_CONFIG_MAPPER.register(e.key, e.config)
    }

    for (let e of (config.entities || [])) {
      ENTITIES_MAPPER.register(e.key || e.entity.name, e.entity)
    }

    for (let e of (config.entitiesService || [])) {
      SERVICES_MAPPER.register(e.key || e.service.name, e.service)
    }

    for (let e of (config.formTypes || [])) {
    }

    let module: ModuleWithProviders<DynamicFormsModule> = {
      ngModule: DynamicFormsModule,
      providers: components
    }
    return module;
  }

}
