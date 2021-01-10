import { EventEmitter } from "events";

export enum TRANSPORT_EVENTS {
    REQUEST = 'request'
}

export interface ITransport extends EventEmitter {
    on(event: TRANSPORT_EVENTS.REQUEST, listener: (send: (err: Error, data: any) => void, ...args: any[]) => void): this;
    emit(event: TRANSPORT_EVENTS.REQUEST, send: (err: Error, data: any) => void, ...args: any[]): boolean;
}

export interface ITransportRequestHandler extends EventEmitter {

}
