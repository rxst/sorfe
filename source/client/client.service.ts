import { RequestGenerator } from "../generators/request.generator";
import { IResponseReject, IResponseSuccess } from "../validators/interfaces/response.interfaces";
import { IRequest } from '../validators/interfaces/request.interfaces';
import { v4 } from 'uuid';
import { ValidatorService } from "../validators/validator";

/**
 * Abstract transport implementation
 */
export abstract class Transport {
    abstract send(request: IRequest): Promise<IResponseSuccess | IResponseReject>
}

/**
 * Sorfe client service for send requests and catch resolves
 */
export class Sorfe<T extends Transport> {
    private requestGenerator: RequestGenerator = new RequestGenerator();
    private validator: ValidatorService = new ValidatorService();

    private getRequest(service: string, method: string, params: any[]) {
        this.requestGenerator.clear();

        this.requestGenerator.setData({
            id: v4(),
            service,
            method,
            params
        })

        return this.requestGenerator.get()
    }

    constructor(private transport: T) {
    }

    public send<T>(service: string, method: string, ...params: any[]): Promise<T> {
        return new Promise<T>((async (resolve, reject) => {
            const response = await this.validator.validateResponse(await this.transport.send(await this.getRequest(service, method, params)));
            if (response) {
                if ("error" in response) {
                    reject(response.error);
                }

                if ("result" in response) {
                    resolve(response.result);
                }
            } else {
                reject(new Error('Message has not valid type'));
            }
        }))
    }
}
