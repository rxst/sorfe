import 'reflect-metadata';
import { Transport, Sorfe } from './client.service';
import { IRequest } from "../validators/interfaces/request.interfaces";
import { IResponseReject, IResponseSuccess } from "../validators/interfaces/response.interfaces";

class TransportTestImpl implements Transport {
    public isSuccess: boolean = false;


    send(request: IRequest): Promise<IResponseSuccess | IResponseReject> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.isSuccess ? {...request, result: Math.floor(Math.random() * 300) } : {
                    ...request,
                    error: {
                        code: 3000,
                        message: 'Error',
                        data: new Error('Error')
                    }
                })
            }, Math.floor(Math.random() * 300))
        })
    }

}

describe("Client service", () => {
    test('Create with Transport impl', () => {
        expect(new Sorfe(new TransportTestImpl)).toBeDefined()
    })
})
