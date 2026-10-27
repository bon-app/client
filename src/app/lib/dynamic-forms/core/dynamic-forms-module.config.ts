type TypeOption = { name: string; [key: string]: any };
import { EntityConfig } from "./entity.config";

export class DynamicFormsModuleConfig {
    public entitiesConfig?: { key: string, config: EntityConfig }[] = [];
    public entities?: { key?: string, entity: any }[] = [];
    public entitiesService?: { key?: string, service: any }[] = [];
    public formTypes?: TypeOption[] = [];
}