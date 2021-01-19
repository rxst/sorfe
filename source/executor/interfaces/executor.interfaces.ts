import { ClassType } from "class-transformer/ClassTransformer";

export interface IExecutor {
    call: <T>(service: string, method: string, ...params: any[]) => Promise<T>
}

export  interface ICommonClass {
    [key: string]: any;

    '__proto__': any,
    prototype: any
}

export interface IExecutorServiceOptions {
    services: ClassType<ICommonClass>[],
}
