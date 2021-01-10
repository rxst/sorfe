import { MessageGenerator } from "./abstract.message.generator";
import { IRequest } from "../../validators/interfaces/request.interfaces";
import { IIterableDataField } from "./generator.interfaces";
import { ValidatorService } from "../../validators/validator";

export class RequestGenerator extends MessageGenerator<IRequest> {
    private validator: ValidatorService = new ValidatorService()

    validate(data: IIterableDataField): Promise<IIterableDataField | undefined> {
        return this.validator.validateRequest(data);
    }
}
