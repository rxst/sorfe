import { MessageGenerator } from "./abstract.message.generator";
import { IResponseReject, IResponseSuccess } from "../../validators/interfaces/response.interfaces";
import { IIterableDataField } from "./generator.interfaces";
import { ValidatorService } from "../../validators/validator";

export class ResponseGenerator extends MessageGenerator<IResponseSuccess | IResponseReject> {
    private validator: ValidatorService = new ValidatorService()

    validate(data: IIterableDataField): Promise<IIterableDataField | undefined> {
        return this.validator.validateResponse(data);
    }
}
