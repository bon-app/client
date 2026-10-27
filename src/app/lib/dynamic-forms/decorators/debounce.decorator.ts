export function Debounce(wait: number) {
    let timeout: any = null;

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args) {
            const cont = this; clearTimeout(timeout);
            return new Promise((resolve, reject) => {

                timeout = setTimeout(() => {
                    resolve(originalMethod.apply(cont, [...args, timeout]));
                }, wait);

            });
        };
        return descriptor;
    };
}