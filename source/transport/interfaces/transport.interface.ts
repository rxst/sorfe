import { EventEmitter } from "events";

export enum TRANSPORT_EVENTS {
    REQUEST = 'request'
}

export type RequestSend = (err: Error | null, data: any) => void;
export type RequestData = {
    service: string;
    method: string;
    params: any[]
}

export interface ITransport extends EventEmitter {
    on(event: TRANSPORT_EVENTS.REQUEST, listener: (send: RequestSend, request: RequestData) => void): this;
    emit(event: TRANSPORT_EVENTS.REQUEST, send: RequestSend, request: RequestData): boolean;
}
