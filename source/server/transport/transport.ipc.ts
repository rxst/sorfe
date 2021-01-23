import { TransportAbstract } from "./transport.abstract";
import { IResponseReject, IResponseSuccess } from "../../validators/interfaces/response.interfaces";
import { IRequest } from "../../validators/interfaces/request.interfaces";
import { ipcMain, IpcMainEvent } from 'electron';

export class TransportIpc extends TransportAbstract {
    private static _ipcChannel: string = process.env.IPC_CHANNEL || 'sorfe';

    /**
     * Method realized ipc communications by "sorfe" channel. Channel can be changed by IPC_CHANNEL env parameter
     */
    transportMessageHandler(listener: (message: IRequest, send: (response: (IResponseSuccess | IResponseReject)) => void) => void): void {
        ipcMain.on(TransportIpc._ipcChannel, (event: IpcMainEvent, request: IRequest) => {
            listener(request, async (response: IResponseSuccess | IResponseReject) => {
                event.reply(response);
            })
        });
    }

}
