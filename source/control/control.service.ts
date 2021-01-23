import { IControlServiceOptions } from "./interfaces/control.service.interfaces";
import { TransportAbstract } from "../transport/transport.abstract";
import { ExecutorService } from "../executor/executor.service";
import { RequestData, RequestSend, TRANSPORT_EVENTS } from "../transport/interfaces/transport.interface";

export class Sorfe<T extends TransportAbstract> {
    private readonly _transport: T;
    private readonly _executor: ExecutorService;

    constructor(options: IControlServiceOptions<T>) {
        this._transport = new options.transport();
        this._executor = new ExecutorService({ services: options.services })

        this.start();
    }

    private start() {
        if (!this._transport || !this._executor) throw new Error('Inner error transport or executor not started!');

        this._transport.on(TRANSPORT_EVENTS.REQUEST, (send: RequestSend, request: RequestData) => {
            this._executor.call<any>(request.service, request.method, ...request.params)
                .then(data => send(null, data))
                .catch(err => send(err, null))
        })
    }
}
