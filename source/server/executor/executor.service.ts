import {
    IExecutor,
    IExecutorServiceOptions,
    IPC_MESSENGER_SERVICE_NAME,
    IS_IPC_MESSENGER_SERVICE
} from "./interfaces/executor.interfaces";
import { ExecutorEndpoint } from "./endpoint/executor.endpoint";

/**
 * This service create instance of Endpoint Services and execute them in call.
 */
export class ExecutorService implements IExecutor {
    private _endpoints: Map<string, ExecutorEndpoint> = new Map<string, ExecutorEndpoint>();

    /**
     * Constructor of service for call specified method from service by call() function
     * @param options.services - not created class
     */
    constructor(options: IExecutorServiceOptions) {
        options.services
            .map(c => new c())
            .filter(initClass => !!initClass && !!initClass.__proto__ && !!Reflect.getMetadata(IS_IPC_MESSENGER_SERVICE, initClass.constructor, "class") && !!Reflect.getMetadata(IPC_MESSENGER_SERVICE_NAME, initClass.constructor, "class"))
            .forEach(endPoint => {
                const serviceName = Reflect.getMetadata(IPC_MESSENGER_SERVICE_NAME, endPoint.constructor, "class");

                if (!!this._endpoints.get(serviceName)) throw new Error(`Service ${ serviceName } is already created`);

                this._endpoints.set(serviceName, new ExecutorEndpoint(endPoint));
            })
    }

    /**
     * Method execute specified method from service
     * @param service - service name which called
     * @param method - method name from service
     * @param params - function parameters will be spreading to method
     */
    public async call<T>(service: string, method: string, ...params: any): Promise<T> {
        const endpoint = this._endpoints.get(service)

        if (endpoint) {
            return endpoint.call<T>(method, ...params)
        } else {
            throw new Error(`Service ${ service } not registered as Endpoint`);
        }

    }

    public async stop(): Promise<void> {
        this._endpoints.forEach(value => value.stop())
    }
}
