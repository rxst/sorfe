import { EventEmitter } from "events";
import { ITransport, TRANSPORT_EVENTS } from "./interfaces/transport.interface";
import { IRequest } from "../../validators/interfaces/request.interfaces";
import { IResponseReject, IResponseSuccess } from "../../validators/interfaces/response.interfaces";
import { ValidatorService } from "../../validators/validator";
import { ResponseGenerator } from "../../generators/response.generator";

/**
 * Transport abstract class is class for manage all income messages
 */
export abstract class TransportAbstract extends EventEmitter implements ITransport {
    private validator: ValidatorService = new ValidatorService();
    private responseGenerator: ResponseGenerator = new ResponseGenerator();

    private generateErrorMessage(error: Error): object {
        return {
            error: {
                code: 32000,
                message: error.message,
                data: Error
            }
        }
    }

    private generateResponseMessage(data: any): object {
        return {
            result: data
        }
    }

    constructor() {
        super();

        this.transportMessageHandler(async (message: any, send) => {
            const isValidRequest = await this.validator.validateRequest(message)

            if (!!message && !Array.isArray(isValidRequest) && !!isValidRequest) {
                this.emit(TRANSPORT_EVENTS.REQUEST, async (error: Error | null, data: any) => {
                    this.responseGenerator.clear();
                    this.responseGenerator.setData({
                        id: message.id,
                        ...(!!error ? this.generateErrorMessage(error) : this.generateResponseMessage(data))
                    });
                    send(await this.responseGenerator.get());
                }, message);
            } else if (!!message && message.id) {
                this.responseGenerator.clear();
                this.responseGenerator.setData({
                    id: message.id,
                    ...this.generateErrorMessage(new Error('Request not valid'))
                })
                this.responseGenerator.get()
                    .then(data => send(data))
                    .catch(() => send({
                        jsonrpc: "2.0",
                        id: message.id,
                        error: {
                            code: 34001,
                            message: 'Request parameter id not correct',
                            data: new Error('Request parameter id not correct')
                        }
                    }))
            } else {
                send({
                    jsonrpc: "2.0",
                    id: '-1',
                    error: {
                        code: 34000,
                        message: 'Request have not message',
                        data: new Error('Request have not message')
                    }
                })
            }
        })
    }

    /**
     * Function must be implemented for different methods of communications between parts of a solution
     * @param listener.message - is parameter of message that will be used in service. Must be in JSON RPC 2.0
     * @param listener.send - method for message send back
     */
    abstract transportMessageHandler(listener: (message: IRequest, send: (response: IResponseSuccess | IResponseReject) => void) => void): void;
}
