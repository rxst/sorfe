import { ICommonClass } from "../interfaces/executor.interfaces";

export class ExecutorEndpoint {

    private _methods: Map<string, string> = new Map<string, string>();

    public get name(): string {
        return this.value.__proto__.__sorfeServiceName;
    }

    public isActiveMethod(methodName: string): boolean {
        return !!this._methods.get(methodName);
    }

    private mapEndPointMethods<T extends ICommonClass>(inputClass: T): { originalName: string, endPointName: string }[] {
        const methods = Object.keys(inputClass.__proto__).map(key => ({ key, value: inputClass.__proto__[key] }));
        const endPointMethods = methods.filter(method => method.value && method.value.prototype && method.value.prototype.__isSorfeMethod);
        return endPointMethods.map(method => ({
            originalName: method.key,
            endPointName: method.value.prototype.__sorfeMethodName
        }));
    }

    public getOriginalName(methodName: string): string {
        return this._methods.get(methodName) || '';
    }

    public async call<T>(methodName: string, ...params: any[]): Promise<T> {
        if (!this.isActiveMethod(methodName)) throw new Error(`Method ${methodName} is not available in service ${this.name}`)

        return this.value[this.getOriginalName(methodName)](...params);
    }

    constructor(public value: ICommonClass) {
        this.mapEndPointMethods(value)
            .forEach(method => this._methods.set(method.endPointName, method.originalName))
    }
}
