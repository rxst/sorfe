import { ICommonClass, IPC_MESSENGER_SERVICE_NAME } from "../interfaces/executor.interfaces";

export class ExecutorEndpoint {

    private _methods: Map<string, string> = new Map<string, string>();

    public get name(): string {
        return Reflect.getMetadata(IPC_MESSENGER_SERVICE_NAME, this.value.constructor, "class");
    }

    public isActiveMethod(methodName: string): boolean {
        return !!this._methods.get(methodName);
    }

    private mapEndPointMethods<T extends ICommonClass>(inputClass: T): { originalName: string, endPointName: string }[] {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(inputClass)).map<{ key: string, value: any }>(key => ({ key, value: inputClass.__proto__[key] }));
        const endPointMethods = methods.filter(method => {
            try {
                const valueMeta = Reflect.getMetadata('__isIPCMessengerMethod', method.value);
                const isMethodFunction = !!method && !!method.value && method.value instanceof Function;
                const isFunctionsEndpoint	= !!valueMeta
                return method.key !== "constructor" && isMethodFunction && isFunctionsEndpoint;
            } catch (err) {
                return false;
            }
        });
        return endPointMethods.map(method => {
            const originalName = method.key;
            const endPointName = Reflect.getMetadata('__IPCMessengerMethodName', method.value);

            return {
                originalName,
                endPointName
            }
        });
    }

    public getOriginalName(methodName: string): string {
        return this._methods.get(methodName) || '';
    }

    public async call<T>(methodName: string, ...params: any[]): Promise<T> {
        if (!this.isActiveMethod(methodName)) throw new Error(`Method ${ methodName } is not available in service ${ this.name }`)

        return this.value[this.getOriginalName(methodName)](...params);
    }

    public async stop(): Promise<void> {
        if (this.value.stop) {
            await this.value.stop();
        }
    }

    constructor(public value: ICommonClass) {
        this.mapEndPointMethods(value)
            .forEach(method => this._methods.set(method.endPointName, method.originalName))
    }
}
