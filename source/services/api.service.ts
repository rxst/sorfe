import { rejects } from 'assert';
import { IpcService } from './ipc.service';

interface ICommonClass {
    [key: string]: any;

    '__proto__': any,
    prototype: any
}

export type CommonClass<T extends ICommonClass> = new (...args: any[]) => T;

export class EndPointAPI {
    private static instance: EndPointAPI;
    private services: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
    private endpoints: Map<string, ICommonClass> = new Map<string, ICommonClass>();
    private ipcService: IpcService;

    private constructor(private readonly channel: string = 'serfe') {
        this.ipcService = new IpcService(this.channel);
        this.ipcService.on('request', this.requestListener.bind(this))
    }

    private requestListener(id: string, method: string, params: object, send: (error: Error | undefined, data?: any | undefined) => void): void {
        this.call(id, method, params)
            .then(data => send(undefined, data), err => send(err))
            .catch(err => send(err))
    }

    private mapEndPointMethods<T extends ICommonClass>(inputClass: T): { originalName: string, endPointName: string }[] {
        const methods = Object.keys(inputClass.__proto__).map(key => ({ key, value: inputClass.__proto__[key] }));
        const endPointMethods = methods.filter(method => method.value && method.value.prototype && method.value.prototype.isSorfeEndPoint);
        return endPointMethods.map(method => ({
            originalName: method.key,
            endPointName: method.value.prototype.sorfeSorfeEndPointName
        }));
    }

    /**
     * SetEndPoints - clear previous services list and create new
     * @param endpoints<CommonClass[]> - not initialized class
     */

    public setEndPoints(endpoints: CommonClass<any>[]) {

        this.services.clear();

        endpoints
            .map(CClass => new CClass())
            .forEach((endPoint: ICommonClass) => {
                const proto = endPoint.__proto__;
                if (proto.isSorfeEndPoint && proto.sorfeEndPointName) {
                    const EPMethods = this.mapEndPointMethods(endPoint)
                    this.services.set(
                        proto.sorfeEndPointName,
                        new Map(EPMethods.map(method => [method.endPointName, method.originalName]))
                    );
                    this.endpoints.set(proto.sorfeEndPointName, endPoint);
                } else {
                    throw Error(`EndPointAPI can\`t  work with not decorated class`);
                }
            })

    }

    public static getInstance(channel?: string): EndPointAPI {
        if (!EndPointAPI.instance) {
            EndPointAPI.instance = new EndPointAPI(channel);
        }

        return EndPointAPI.instance;
    }

    public static start(endpoints: CommonClass<any>[], channel?: string): EndPointAPI {
        const api = EndPointAPI.getInstance(channel);

        api.setEndPoints(endpoints);

        return api;
    }

    public call(id: string, callStr: string, param: any): Promise<any> {
        const serviceName = callStr.slice(0, callStr.indexOf(':'));
        const methodName = callStr.slice(callStr.indexOf(':') + 1);
        const serviceMap = this.services.get(serviceName);
        if (serviceMap) {
            const originalMethodName = serviceMap.get(methodName);

            if (!!serviceMap && !!originalMethodName) {
                try {
                    return new Promise((resolve, reject) => {
                        const calledService = this.endpoints.get(serviceName);
                        if (calledService) {
                            const calledMethod = calledService.__proto__[originalMethodName];
                            resolve(calledMethod.apply(calledService, ...param));
                        } else {
                            reject(new Error(`No such service!`))
                        }

                    })
                } catch (e) {
                    return Promise.reject(e);
                }
            } else {
                return Promise.reject(`No such service or method!`);
            }
        } else {
            return Promise.reject(`No such service!`);
        }

    }
}
