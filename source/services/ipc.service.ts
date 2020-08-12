import { IJsonRpcResponseReject, IJsonRpcResponseSuccess } from "../interfaces/ipc.interfaces";
import { ipcMain, IpcMainEvent } from 'electron';
import { EventEmitter } from "events";
import { IPCValidator } from '../validators/validator.service';

export declare interface IpcService {
    on(event: 'request', listener: (id: string, method: string, params: object, send: (error: Error | undefined, data: any | undefined) => void) => void): this;
}

export class IpcService extends EventEmitter {

    private validator: IPCValidator = new IPCValidator();

    constructor(private channel: string) {
        super();

        ipcMain.on(this.channel, this.messageHandler.bind(this))
    }

    private static generateRejectResponseMessage(id: string, code: number, message: string): IJsonRpcResponseReject {
        return {
            jsonrpc: '2.0',
            id,
            error: {
                code,
                message,
                data: (new Date).toISOString()
            }
        }
    }

    private static generateSuccessResponseMessage(id: string, result: any): IJsonRpcResponseSuccess {
        return {
            jsonrpc: '2.0',
            id,
            result
        }
    }

    private static generateResponse(id: string, error: Error | undefined, data: any | undefined) {
        if (!!error) {
            return IpcService.generateRejectResponseMessage(id, -32000, error.message)
        } else if (data !== undefined) {
            return IpcService.generateSuccessResponseMessage(id, data)
        } else {
            return IpcService.generateRejectResponseMessage(id, -32013, 'Unrecognized response from server method')
        }
    }

    private sendResponse(send: Function, id: string): (error: Error | undefined, data: any | undefined) => void {
        return (error: Error | undefined, data: any | undefined) => {
            const responseMsg = IpcService.generateResponse(id, error, data);
            if (this.validator.validateResponse(responseMsg)) {
                send(this.channel, responseMsg);
            } else {
                send(this.channel, IpcService.generateRejectResponseMessage(id, -32000, 'Server error'))
            }
        }
    }

    private messageHandler(event: IpcMainEvent, data: any) {
        const jsonRpcRequest = this.validator.validateRequest(data);

        if (jsonRpcRequest) {
            this.emit('request', jsonRpcRequest.id, jsonRpcRequest.method, jsonRpcRequest.params, this.sendResponse(event.reply, jsonRpcRequest.id));
        } else {
            event.reply(IpcService.generateRejectResponseMessage('', -32600, 'Invalid Request'))
        }

    }
}
