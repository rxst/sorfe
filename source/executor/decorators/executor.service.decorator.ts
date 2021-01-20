import { EventEmitter } from "events";

interface IExecutorServiceDecoratorOptions {
    name: string
}

export function Service(options: IExecutorServiceDecoratorOptions): ClassDecorator {
    return (target) => {
        if (target.prototype instanceof EventEmitter) throw Error('EndPoint decorator can`t work with Event Emitter class');

        if (!!target && target.prototype) {
            target.prototype.__isSorfeService = true;
            target.prototype.__sorfeServiceName = options.name;
        }

        return target;
    }
}
