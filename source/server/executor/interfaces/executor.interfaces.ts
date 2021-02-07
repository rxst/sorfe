export interface IExecutor {
    call: <T>(service: string, method: string, ...params: any[]) => Promise<T>
}

export interface Class<T> {
    new (...args: any[]): T;
    prototype: T;
}

export  interface ICommonClass {
    [key: string]: any;
}

export interface IExecutorServiceOptions {
    services: Class<ICommonClass>[],
}

export const IS_IPC_MESSENGER_SERVICE = 'IPC_MessengerService';
export const IPC_MESSENGER_SERVICE_NAME = 'IPC_MessengerService_Name';
