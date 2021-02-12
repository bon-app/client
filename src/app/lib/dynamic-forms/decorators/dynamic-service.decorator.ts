import { SERVICES_MAPPER } from "../core/mapper"


export function DynamicService(key: string = null) {
    return (constructor: Function) => {
        SERVICES_MAPPER.register(key || constructor.name, constructor)
    }
}