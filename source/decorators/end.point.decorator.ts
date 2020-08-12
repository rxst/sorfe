import { EndPointService } from '../services/end.point.service';

export interface IEndPointOptions {
    name: string;
}

export function EndPoint(options: IEndPointOptions) {
    return function (target: any): any | void {
        if (target.prototype instanceof EndPointService) {
            const original = target;

            const targetWrapperFunction = function (...args: any[]) {
                const endPointService = new target(...args);

                endPointService.__initService(options);

                return endPointService;
            }

            targetWrapperFunction.prototype = original.prototype;

            return targetWrapperFunction;
        } else {
            throw new Error('Decorated class not extend EndPoint service');
        }
    }
}
