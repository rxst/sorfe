import { EndPointService } from './end.point.service';
import { IpcService } from './ipc.service';

export type CommonClass<Result extends object = object> = new (...params: any[]) => Result;

export class EndPointAPI {
    private static instance: EndPointAPI;
    private services: Map<string, string[]> = new Map<string, string[]>();
    private endpoints: Map<string, EndPointService> = new Map<string, EndPointService>();
    private callList: Map<string, (isError: boolean, data: any) => void> = new Map<string, (isError: boolean, data: any) => void>();
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

    /**
     * SetEndPoints - clear previous services list and create new
     * @param endpoints<CommonClass[]> - not initialize d class
     */

    public setEndPoints(endpoints: CommonClass[]) {

        this.services.clear();

        endpoints
            .map(CClass => {
                const IClass = new CClass();

                if (IClass instanceof EndPointService) {
                    this.services.set(IClass.name, IClass.methods);

                    return IClass
                } else {
                    throw new Error(`Class is not instance of EndPointService`);
                }
            })
            .forEach(endPoint => {
                this.endpoints.set(endPoint.name, endPoint);
            })

    }

    public static getInstance(channel?: string): EndPointAPI {
        if (!EndPointAPI.instance) {
            EndPointAPI.instance = new EndPointAPI(channel);
        }

        return EndPointAPI.instance;
    }

    public static start(endpoints: CommonClass[], channel?: string): EndPointAPI {
        const api = EndPointAPI.getInstance(channel);

        api.setEndPoints(endpoints);

        return api;
    }

    public returnResult(callId: string, data: any) {
        const callback = this.callList.get(callId);

        if (data instanceof Promise) {
            data
                .then(res => {
                    callback(false, res)
                    this.callList.delete(callId);
                })
                .catch(e => {
                    callback(true, e)
                    this.callList.delete(callId);
                });
        } else {
            callback(false, data);
        }
    }


    public call(id: string, callStr: string, param: any): Promise<any> {
        const serviceName = callStr.slice(0, callStr.indexOf(':'));
        const methodName = callStr.slice(callStr.indexOf(':') + 1);
        const serviceMap = this.services.get(serviceName);
        if (!!serviceMap && serviceMap.indexOf(methodName) !== -1) {
            try {
                return new Promise((resolve, reject) => {
                    const calledService = this.endpoints.get(serviceName);

                    this.callList.set(id, (isError: boolean, data: any) => {
                        isError ? reject(data) : resolve(data);
                    });

                    calledService.emit(methodName, {id: id}, ...param);
                })
            } catch (e) {
                return Promise.reject(e);
            }
        } else {
            return Promise.reject(`No such service or method!`);
        }
    }
}
