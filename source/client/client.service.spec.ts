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
    describe('Creation', () => {
        test('with transport', () => {
            expect(new Sorfe(new TransportTestImpl())).toBeDefined();
        })
    })

    describe('Data flow', () => {
        let transport: TransportTestImpl;
        let sorfe: Sorfe<TransportTestImpl>;

        beforeAll(() => {
            transport = new TransportTestImpl();
            sorfe = new Sorfe<TransportTestImpl>(transport);
        })


        test('with resolve', () => {
            transport.isSuccess = true;
            expect(sorfe.send('test', 'test', [])).resolves.toBeDefined();
        })

        test('with reject', () => {
            transport.isSuccess = false;
            expect(sorfe.send('test', 'test', [])).rejects.toBeDefined();
        })
    })
})
