import { ENTITIES_MAPPER } from "../core/mapper"


export function DynamicEntity(key: string = null) {
    return (constructor: Function) => {
        ENTITIES_MAPPER.register(key || constructor.name, constructor)
    }
}