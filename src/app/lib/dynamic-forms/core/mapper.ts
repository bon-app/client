export class ENTITIES_MAPPER {
    private static pool: { [key: string]: any } = {};

    static register(key: string, value: any) {
        ENTITIES_MAPPER.pool[key] = value;
    }

    static get(key: string) {
        let entity = ENTITIES_MAPPER.pool[key];
        if (!entity) {
            throw new Error(`No entity mapped for '${key}'`);
        }
        return entity;
    }
}

export class SERVICES_MAPPER {
    private static pool: { [key: string]: any } = {};

    static register(key: string, value: any) {
        SERVICES_MAPPER.pool[key] = value;
    }

    static get(key: string) {
        let type = SERVICES_MAPPER.pool[key];
        if (!type) {
            throw new Error(`No service mapped for '${key}'`);
        }
        return type;
    }
}

export class ENTITIES_CONFIG_MAPPER {
    private static pool: { [key: string]: any } = {};

    static register(key: string, value: any) {
        ENTITIES_CONFIG_MAPPER.pool[key] = value;
    }

    static get(key: string) {
        let entity = ENTITIES_CONFIG_MAPPER.pool[key];
        if (!entity) {
            throw new Error(`No entity config mapped for '${key}'`);
        }
        return entity;
    }
}

window["__TEST"] = {
    ENTITIES_MAPPER,
    SERVICES_MAPPER,
    ENTITIES_CONFIG_MAPPER
}