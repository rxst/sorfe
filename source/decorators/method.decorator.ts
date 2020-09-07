export interface IMethodOptions {
    name: string;
}

export function EndPointMethod(options: IMethodOptions) {
    return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (!(typeof propertyKey === 'string')) {
            throw new Error('Invalid usage: property key must be string');
        }

        if(descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }

        descriptor.value.prototype.isSorfeEndPoint = true;
        descriptor.value.prototype.sorfeSorfeEndPointName = options.name;

        return descriptor;
    };
}
