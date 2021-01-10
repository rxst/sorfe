import 'reflect-metadata';
import { TransportAbstract } from './transport.abstract';
import { IRequest } from "../validators/interfaces/request.interfaces";
import { IResponseReject, IResponseSuccess } from "../validators/interfaces/response.interfaces";
import { EventEmitter } from "events";
import { ValidatorService } from "../validators/validator";
import { TRANSPORT_EVENTS } from "./interfaces/transport.interface";

interface IErrorTypes {
    [key: string]: object;
}

interface IErrorIterable {
    [key: string]: IErrorTypes;
}

class TransportTest extends TransportAbstract {
    private static dataService: EventEmitter = new EventEmitter();

    constructor() {
        super();
    }

    transportMessageHandler(listener: (message: IRequest, send: (response: (IResponseSuccess | IResponseReject)) => void) => void): void {
        TransportTest.dataService.on('data', (request: IRequest, reply: (data: any) => void) => {
            listener(request, async (response: IResponseSuccess | IResponseReject) => {
                reply(response);
            })
        });

        this.on(TRANSPORT_EVENTS.REQUEST, (send: (err: Error | null, data: any) => void) => {
            send(null, { status: 200, data: ['Samuel', 'Josh'] });
        })
    }

    send(data: any): Promise<any> {
        return new Promise<any>(resolve => {
            TransportTest.dataService.emit('data', data, (data: any) => {
                resolve(data);
            });
        })

    }
}

describe('TransportAbstract', () => {


    describe('Creation', () => {
        let instance: TransportTest;

        beforeEach(() => {
            instance = new TransportTest();
        })

        test('test class', () => {
            expect(instance).toBeDefined();
        })
    })

    describe('Handling', () => {


        describe('success', () => {
            const success = {
                no_params: {
                    id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                    jsonrpc: "2.0",
                    method: 'test',
                    params: [],
                    service: 'test'
                },
                has_params: {
                    id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                    jsonrpc: "2.0",
                    method: 'test',
                    params: [ 'jest', 0, { a: 0, b: '' }, [] ],
                    service: 'test'
                }
            }
            const validator = new ValidatorService();
            let instance: TransportTest;
            let emitFn: jest.SpyInstance;
            beforeEach(() => {
                instance = new TransportTest();
                emitFn = jest.spyOn(instance, 'emit');
            })


            test('params has no params', () => {
                return instance.send(success.no_params)
                    .then(data => {
                        expect(emitFn).toHaveBeenCalledTimes(1);
                        expect(validator.validateResponseSuccess(data)).toBeDefined();
                    })
            })

            test('params has multiple params', () => {
                return instance.send(success.no_params)
                    .then(data => {
                        expect(emitFn).toHaveBeenCalledTimes(1);
                        expect(validator.validateResponseSuccess(data)).toBeDefined();
                    })
            })

        })


        describe('reject', () => {
            const errorId = {
                absent: {
                    jsonrpc: "2.0",
                    method: 'test',
                    params: [],
                    service: 'test'
                },
                wrong: {
                    id: 'id',
                    jsonrpc: "2.0",
                    method: 'test',
                    params: [],
                    service: 'test'
                }
            }

            const error: IErrorIterable = {
                jsonrpc: {
                    absent: {
                        id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                        method: 'test',
                        params: [],
                        service: 'test'
                    },
                    wrong: {
                        id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                        jsonrpc: "1.0",
                        method: 'test',
                        params: [],
                        service: 'test'
                    }
                },
                method: {
                    absent: {
                        id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                        jsonrpc: "2.0",
                        params: [],
                        service: 'test'
                    },
                    wrong: {
                        id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                        jsonrpc: "2.0",
                        method: 13,
                        params: [],
                        service: 'test'
                    }
                },
                params: {
                    absent: {
                        id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                        jsonrpc: "2.0",
                        method: 'test',
                        service: 'test'
                    },
                    wrong: {
                        id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                        jsonrpc: "2.0",
                        method: 'test',
                        params: {},
                        service: 'test'
                    }
                },
                service: {
                    absent: {
                        id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                        jsonrpc: "2.0",
                        method: 'test',
                        params: [],
                    },
                    wrong: {
                        id: '0fc8c0dc-1b3f-4643-b3e0-4b85dee963bc',
                        jsonrpc: "2.0",
                        method: 'test',
                        params: [],
                        service: 12
                    }
                }

            }

            const errorIdObj = {
                jsonrpc: "2.0",
                id: '-1',
                error: {
                    code: 34000,
                    message: 'Request have not message',
                    data: new Error('Request have not message')
                }
            }

            const validator = new ValidatorService();

            let instance: TransportTest;
            let emitFn: jest.SpyInstance;

            beforeEach(() => {
                instance = new TransportTest();
                emitFn = jest.spyOn(instance, 'emit');
            })

            describe('incorrect data as message', () => {

                test('undefined', () => {
                    return instance.send(undefined)
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual(errorIdObj)
                        })
                })

                test('null', () => {
                    return instance.send(null)
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual(errorIdObj)
                        })
                })

                test('empty array', () => {
                    return instance.send([])
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual(errorIdObj)
                        })
                })

                test('empty string', () => {
                    return instance.send('')
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual(errorIdObj)
                        })
                })

                test('string', () => {
                    return instance.send(Math.random().toString(36).substring(7))
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual(errorIdObj)
                        })
                })

                test('number', () => {
                    return instance.send(Math.floor(Math.random() * Math.LOG10E))
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual(errorIdObj)
                        })
                })

                test('empty object', () => {
                    return instance.send({})
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual(errorIdObj)
                        })
                })
            })




            describe('id parameter', () => {
                test('absent', () => {
                    return instance.send(errorId.absent)
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual(errorIdObj)
                        })
                })

                test('wrong', () => {
                    return instance.send(errorId.wrong)
                        .then(data => {
                            expect(emitFn).toHaveBeenCalledTimes(0)
                            expect(data).toEqual({
                                jsonrpc: "2.0",
                                id: errorId.wrong.id,
                                error: {
                                    code: 34001,
                                    message: 'Request parameter id not correct',
                                    data: new Error('Request parameter id not correct')
                                }
                            })
                        })
                })
            })


            describe('parameters', () => {
                for (const parameter in error) {
                    if (error.hasOwnProperty(parameter)) {
                        const errorList = error[parameter]

                        describe(parameter, () => {
                            for (const errorType in errorList) {
                                if (errorList.hasOwnProperty(errorType)) {
                                    test(errorType, () => {
                                        return instance.send(errorList[errorType])
                                            .then(data => {
                                                expect(emitFn).toHaveBeenCalledTimes(0)
                                                expect(validator.validateResponseReject(data)).toBeDefined()
                                            })
                                    })
                                }
                            }
                        })
                    }
                }
            })

        })
    })

})
