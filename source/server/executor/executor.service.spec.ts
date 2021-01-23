import { ExecutorService } from './executor.service';
import { Service } from './decorators/executor.service.decorator';
import { Method } from './decorators/executor.method.decorator';

@Service({ name: 'simple' })
class SimpleTestEndpoint {

    @Method({ name: 'test' })
    public callableTestMethod(a: string = '', b: number = 0): string {
        return `${ a }_${ b }`;
    }

    @Method({ name: 'exampleString' })
    public exampleString(length: number = Math.floor(Math.random() * 100)): string {
        return Array.from({length}, () => 'a').join('')
    }

    @Method({ name: 'exampleNumber' })
    public exampleNumber(a: number = 0): number {
        return a * a;
    }

    @Method({ name: 'exampleArray' })
    public exampleArray<T>(): T[] {
        return []
    }

    @Method({ name: 'exampleBoolean' })
    public exampleBoolean(): boolean {
        return true;
    }


    @Method({ name: 'exampleObject' })
    public exampleObject(): Object {
        return {
            a: 0,
            b: '11'
        }
    }

    @Method({ name: 'examplePromiseResolve' })
    public examplePromiseResolve(time: number): Promise<boolean> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true)
            }, time)
        })
    }

    @Method({ name: 'examplePromiseReject' })
    public examplePromiseReject(time: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error())
            }, time)
        })
    }
}

@Service({ name: 'simple' })
class DuplicatedTestEndpoint {

    @Method({ name: 'test' })
    public callableTestMethod(a: string, b: number) {
        return `${ b }_${ a }`;
    }
}

@Service({ name: 'modified' })
class ModifiedTestEndpoint {

    @Method({ name: 'stringAndNumberConcat' })
    public callableTestMethod(a: string, b: number) {
        return `modified_${ a }_${ b }`;
    }
}

class NotEndpointService {
    test() {

    }
}

describe('creation', () => {
    test('with no endpoint service', () => {
        const eS = new ExecutorService({ services: [ NotEndpointService ] });

        expect(eS).toBeDefined()
        expect(eS.call('service', 'method', 1, 2, 4, 5)).rejects.toThrow();
    })

    test('without services', () => {
        const eS = new ExecutorService({ services: [] });

        expect(eS).toBeDefined();
        expect(eS.call('simple', 'test', [])).rejects.toThrow();
        expect(eS.call('test', 'simple', 'asdasd', 1, 3)).rejects.toThrow();
    })

    test('with one service', () => {
        const eS = new ExecutorService({ services: [ SimpleTestEndpoint ] })

        expect(eS).toBeDefined()
        expect(eS.call('test', 'simple', 'asdasd', 1, 3)).rejects.toThrow();
        expect(eS.call('simple', 'test', 'test', 1)).resolves.toEqual('test_1');
    })

    test('with services who have one name', () => {
        expect(() => {
            new ExecutorService({ services: [ SimpleTestEndpoint, DuplicatedTestEndpoint ] })
        })
            .toThrow()
    })

    test('With multiple instance of one service', () => {
        expect(() => {
            new ExecutorService({ services: [ ...Array.from({ length: 10 }, () => SimpleTestEndpoint) ] })
        })
            .toThrow()
    })

    test('With few services', () => {
        const eS = new ExecutorService({ services: [ SimpleTestEndpoint, ModifiedTestEndpoint ] })

        expect(eS.call('modified', 'stringAndNumberConcat', 'test', 1))
            .resolves
            .toEqual('modified_test_1')

        expect(eS.call('simple', 'test', 'test', 2))
            .resolves
            .toEqual('test_2')
    })
})

describe('call', () => {
    const eS = new ExecutorService({
        services: [
            SimpleTestEndpoint
        ]
    })

    const simpleClass = new SimpleTestEndpoint();

    describe('parameters for function is ', () => {
        test('wrong params option', () => {
            expect(eS.call('simple', 'test')).resolves.toEqual('_0')
            expect(eS.call('simple', 'test', [], 'z')).resolves.toEqual('_z')
            expect(eS.call('simple', 'test', [ 'a' ], 'z')).resolves.toEqual('a_z')
        })

        test('wrong service option', () => {
            expect(eS.call('s1mple', 'test')).rejects.toThrow();
        })
        test('wrong method option', () => {
            expect(eS.call('simple', 't3st')).rejects.toThrow();
        })
    })

    describe('with different return type', () => {
        test('string', () => {
            expect(eS.call('simple', 'exampleString', 15)).toBeDefined()
            expect(eS.call('simple', 'exampleString', 0)).resolves.toBeDefined()
            expect(eS.call('simple', 'exampleString', 400)).resolves.toEqual(simpleClass.exampleString(400))
        })

        test('number', () => {
            expect(eS.call('simple', 'exampleNumber', 15)).toBeDefined()
            expect(eS.call('simple', 'exampleNumber', 15)).resolves.toBeDefined()
            expect(eS.call('simple', 'exampleNumber', 15)).resolves.toEqual(simpleClass.exampleNumber(15))
        })

        test('boolean', () => {
            expect(eS.call('simple', 'exampleBoolean', 15)).toBeDefined()
            expect(eS.call('simple', 'exampleBoolean', 15)).resolves.toBeDefined()
            expect(eS.call('simple', 'exampleBoolean', 15)).resolves.toEqual(simpleClass.exampleBoolean())
        })

        test('array', () => {
            expect(eS.call('simple', 'exampleArray', 15)).toBeDefined()
            expect(eS.call('simple', 'exampleArray', 15)).resolves.toBeDefined()
            expect(eS.call('simple', 'exampleArray', 15)).resolves.toEqual(simpleClass.exampleArray())
        })

        test('promise resolve', () => {
            expect(eS.call('simple', 'examplePromiseResolve', 15)).toBeDefined()
            expect(eS.call('simple', 'examplePromiseResolve', 15)).resolves.toBeDefined()
            expect(eS.call('simple', 'examplePromiseResolve', 15)).resolves.toEqual(true)
        })

        test('promise reject', () => {
            expect(eS.call('simple', 'examplePromiseReject', 15)).toBeDefined()
            expect(eS.call('simple', 'examplePromiseReject', 15)).rejects.toBeDefined()
            expect(eS.call('simple', 'examplePromiseReject', 15)).rejects.toThrowError()
        })
    })
})
