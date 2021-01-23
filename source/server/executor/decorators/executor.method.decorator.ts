interface IExecutorMethodDecoratorOptions {
    name: string
}

export function Method(options: IExecutorMethodDecoratorOptions) {
    return (target: Object, propertyKey: string, descriptor: PropertyDescriptor | undefined) => {
        if(descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }

        if (descriptor && descriptor.value instanceof Function) {
            descriptor.value.prototype.__isSorfeMethod = true;
            descriptor.value.prototype.__sorfeMethodName = options.name;
        }

        return descriptor;
    };
}
