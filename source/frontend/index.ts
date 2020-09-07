import { IPCValidator } from '../validators/validator.service';
import { IJsonRpcResponseReject, IJsonRpcResponseSuccess } from '../interfaces/ipc.interfaces';
import { v4 as uuidv4 } from 'uuid';

interface IpcRenderer extends NodeJS.EventEmitter {

    invoke(channel: string, ...args: any[]): Promise<any>;

    on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;

    once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;

    postMessage(channel: string, message: any, transfer?: MessagePort[]): void;

    removeAllListeners(channel: string): this;

    removeListener(channel: string, listener: (...args: any[]) => void): this;

    send(channel: string, ...args: any[]): void;

    sendSync(channel: string, ...args: any[]): any;

    sendTo(webContentsId: number, channel: string, ...args: any[]): void;

    sendToHost(channel: string, ...args: any[]): void;
}

interface IpcRendererEvent extends Event {
    ports: MessagePort[];
    sender: IpcRenderer;
    senderId: number;
}

export class EndPointCallService {

    private readonly ipc: IpcRenderer;
    private validator: IPCValidator = new IPCValidator();
    private responseList: Map<string, { callback: (isError: boolean, data: any) => void }> = new Map<string, {callback: (isError: boolean, data: any) => void}>();
    private requestCounter = 0;

    constructor(private channel: string = 'serfe') {
        if (!!(window as any).require) {
            this.ipc = ((window as any).require('electron')).ipcRenderer;
            this.startIpc();
        } else {
            console.error(new Error('Application start not in electron or without node integration!'))
        }
    }


    private startIpc() {
        this.ipc.on(this.channel, this.ipcChannelListener.bind(this));
    }

    private ipcChannelListener(event: IpcRendererEvent, data: any) {
        const jsonResponse = this.validator.validateResponse(data)
        if (!!jsonResponse) {
            const optionObj = this.responseList.get(data.id);
            const isResponseError = !!(jsonResponse as IJsonRpcResponseReject).error;
            optionObj.callback(isResponseError, isResponseError ? (jsonResponse as IJsonRpcResponseReject).error : (jsonResponse as IJsonRpcResponseSuccess).result);
        } else {
            if (!!data && !!data.id) {
                const optionObj = this.responseList.get(data.id);
                optionObj.callback(true, 'IPC validation error');
            } else {
                console.error(new Error(`Data is not correct`));
            }
        }

    }

    public stopIpc() {
        if (this.ipc) {
            this.ipc.removeAllListeners(this.channel);
        }
    }

    public get getChannel(): string {
        return  this.channel;
    }

    public set setChannel(channel: string) {
        this.channel = channel;
    }

    private buildRequest(id: string, method: string, params: any[]) {
        return {
            jsonrpc: '2.0',
            method,
            params,
            id
        }
    }

    public call<T>(service: string, method: string, ...params: any): Promise<T> {
        if (this.ipc) {
            return new Promise<T>((resolve, reject) => {
                const requestId = uuidv4();
                const methodRequestString = `${service}:${method}`;

                this.responseList.set(requestId, {
                    callback: (isError: boolean, data: any) => {
                        if (isError) {
                            reject(data || `In ${requestId} we have error`);
                        } else {
                            resolve(data);
                        }
                    }
                })

                this.ipc.send(this.channel, this.buildRequest(requestId, methodRequestString, params))
            })
        }

        return Promise.reject(new Error(`Error in call`));
    }

}
