import { IIterableDataField } from './generator.interfaces';

export abstract class MessageGenerator<T extends IIterableDataField> {
    private data: IIterableDataField = {};

    private _defaultFields: IIterableDataField = {
        jsonrpc: '2.0'
    }

    public setData(data: IIterableDataField): void {
        this.data = {
            ...this.data,
            ...data
        }
    }

    private generate(): IIterableDataField {
        return {
            ...this._defaultFields,
            ...this.data
        }
    }

    public abstract validate(data: IIterableDataField): Promise<IIterableDataField | undefined>

    public async get(): Promise<T> {
        const validatedMessage = await this.validate(this.generate())

        if (validatedMessage) return validatedMessage as T;
        else throw new Error('Message not valid')
    }

    public clear(): void {
        this.data = {};
    }
}
