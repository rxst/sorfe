import { EndPointService } from "../services/end.point.service";
import { EndPointAPI } from '../services/api.service';

export interface IMethodOptions {
    name: string;
}

export function EndPointMethod(options: IMethodOptions) {
    return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (!(target instanceof EndPointService)) {
            throw new Error('Invalid usage: proto must be instance of EndPointService');
        }

        if (!(typeof propertyKey === 'string')) {
            throw new Error('Invalid usage: property key must be string');
        }

        if(descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }

        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const callOptions = args[0];
            const fnArgs = args.slice(1);
            try {
                if (callOptions && (!!callOptions.id || callOptions.id === 0)) {
                    const functionRes = originalMethod.apply(this, fnArgs);

                    EndPointAPI.getInstance().returnResult(callOptions.id, functionRes);

                    return functionRes;
                } else {
                    return originalMethod.apply(this, args);
                }
            } catch (e) {
                if (callOptions && (!!callOptions.id || callOptions.id === 0)) {
                    EndPointAPI.getInstance().returnResult(callOptions.id, e);
                } else {
                    throw e;
                }
            }
        }

        descriptor.value.prototype.isEndpoint = true;
        descriptor.value.prototype.name = options.name;

        return descriptor;
    };
}