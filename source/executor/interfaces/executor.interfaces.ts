export interface IExecutor {
    call: <T>(service: string, method: string, ...params: any[]) => Promise<T>
}

interface Class<T> {
    new (...args: any[]): T;
    prototype: T;
}

export  interface ICommonClass {
    [key: string]: any;
}

export interface IExecutorServiceOptions {
    services: Class<ICommonClass>[],
}
