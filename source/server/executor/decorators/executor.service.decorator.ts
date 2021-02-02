import 'reflect-metadata'
import { IPC_MESSENGER_SERVICE_NAME, IS_IPC_MESSENGER_SERVICE } from "../interfaces/executor.interfaces";

interface IExecutorServiceDecoratorOptions {
    name: string
}

export function Service(options: IExecutorServiceDecoratorOptions): ClassDecorator {
    return (target) => {

        Reflect.defineMetadata(IS_IPC_MESSENGER_SERVICE, true, target, "class");
        Reflect.defineMetadata(IPC_MESSENGER_SERVICE_NAME, options.name, target, "class");

        return target;
    }
}
