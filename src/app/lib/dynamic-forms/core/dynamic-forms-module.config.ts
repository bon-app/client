import { TypeOption } from "@ngx-formly/core/lib/services/formly.config";
import { EntityConfig } from "./entity.config";

export class DynamicFormsModuleConfig {
    public entitiesConfig?: { key: string, config: EntityConfig }[] = [];
    public entities?: { key?: string, entity: any }[] = [];
    public entitiesService?: { key?: string, service: any }[] = [];
    public formTypes?: TypeOption[] = [];
}