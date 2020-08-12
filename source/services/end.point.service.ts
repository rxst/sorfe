import { IEndPointOptions } from "../decorators/end.point.decorator";
import { EventEmitter } from 'events';

export class EndPointService extends EventEmitter {
    private _serviceName: string;
    private _availableMethods: string[] = [];

    public get name(): string {
        return this._serviceName;
    }

    public get methods(): string[] {
        return this._availableMethods;
    }

    private __setServiceName(name: string) {
        this._serviceName = name;
    }

    public __creteMethodsEvents() {
        for (let methodName in this) {
            const fnObj = this[methodName];
            if (!!fnObj && typeof fnObj === "function" && !!fnObj.prototype && !!fnObj.prototype.isEndpoint && !!fnObj.prototype.name) {
                const listenerName = fnObj.prototype.name || methodName;
                this.addListener(listenerName, fnObj.bind(this));
                this._availableMethods.push(listenerName);
            }
        }
    }

    public __initService(options: IEndPointOptions) {
        this.__setServiceName(options.name);
        this.__creteMethodsEvents();
    }
}