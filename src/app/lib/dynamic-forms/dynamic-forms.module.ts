import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FormlyConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { JoditAngularModule } from 'jodit-angular';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { HtmlEditorComponent } from './components/dynamic-form-custom-template/html-editor/html-editor.component';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { DynamicListComponent } from './components/dynamic-list/dynamic-list.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { DynamicFormsModuleConfig } from './core';
import { ENTITIES_CONFIG_MAPPER, ENTITIES_MAPPER, SERVICES_MAPPER } from './core';
import { DynamicManyRelationComponent } from './components/dynamic-many-relation/dynamic-many-relation.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { ManyRelationComponent } from './components/many-relation/many-relation.component';
import { UploadImagePreviewComponent } from './components/upload-image-preview/upload-image-preview.component';
import { OneRelationComponent } from './components/one-relation/one-relation.component';


const components = [
  DynamicFormComponent,
  HtmlEditorComponent,
  DynamicListComponent,
  DynamicManyRelationComponent,
  SafeHtmlPipe
];

@NgModule({
  declarations: components,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    FormlyModule.forChild({
      types: [
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
      SERVICES_MAPPER.register(e.key|| e.service.name, e.service)
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
