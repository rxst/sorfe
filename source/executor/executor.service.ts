import { IExecutor, IExecutorServiceOptions } from "./interfaces/executor.interfaces";
import { ExecutorEndpoint } from "./endpoint/executor.endpoint";

export class ExecutorService implements IExecutor {
    private _endpoints: Map<string, ExecutorEndpoint> = new Map<string, ExecutorEndpoint>();

    constructor(options: IExecutorServiceOptions) {
        options.services
            .map(c => new c())
            .filter(initClass => !!initClass.__proto__.__isSorfeService && !!initClass.__proto__.__sorfeServiceName)
            .forEach(endPoint => this._endpoints.set(endPoint.__proto__.__sorfeServiceName, new ExecutorEndpoint(endPoint)))
    }

    public async call<T>(service: string, method: string, ...params: any): Promise<T> {
        const endpoint = this._endpoints.get(service)

        if (endpoint) {
            return endpoint.call<T>(method, ...params)
        } else {
            throw new Error(`Service ${service} not registered as Endpoint`);
        }

    }
}
