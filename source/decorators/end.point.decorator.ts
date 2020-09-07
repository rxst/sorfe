import { EventEmitter } from "events";

export interface IEndPointOptions {
    name: string;
}

export function EndPoint(options: IEndPointOptions) {
    return function (target: any): any | void {

        if (target.prototype instanceof EventEmitter) throw Error('EndPoint decorator can`t work with Event Emitter class');

        target.prototype.isSorfeEndPoint = true;
        target.prototype.sorfeEndPointName = options.name;

        return target;
    }
}
