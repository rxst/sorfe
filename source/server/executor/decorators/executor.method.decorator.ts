import "reflect-metadata";

interface IExecutorMethodDecoratorOptions {
    name: string
}

export function Method(options: IExecutorMethodDecoratorOptions) {
    return (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor | undefined) => {

        Reflect.defineMetadata('__isIPCMessengerMethod', true, descriptor?.value);
        Reflect.defineMetadata('__IPCMessengerMethodName', options.name, descriptor?.value);

        return descriptor;
    };
}
