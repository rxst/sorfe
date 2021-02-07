import { ClassType } from "class-transformer/ClassTransformer";
import { plainToClass } from "class-transformer";
import { Validator } from "class-validator";
import { IResponseReject, IResponseSuccess } from "./interfaces/response.interfaces";
import { ResponseRejectValidator } from "./response/response.reject.validator";
import { RequestValidator } from "./request/request.validator";
import { IRequest } from "./interfaces/request.interfaces";
import { ResponseResolveValidator } from "./response/response.resolve.validator";

export class ValidatorService {
    private validator: Validator = new Validator();

    async validate<T>(data: any, classValidator: ClassType<T>): Promise<T | undefined> {
        try {
            const classData = plainToClass<T, any>(classValidator, data);
            const errors = await this.validator.validate(classData)
            return errors.length === 0 ? classData : undefined;
        } catch (e) {
            return Promise.resolve(undefined)
        }
    }

    async validateResponseReject(data: any): Promise<IResponseReject | undefined> {
        return this.validate<IResponseReject>(data, ResponseRejectValidator)
    }

    async validateResponseSuccess(data: any): Promise<IResponseSuccess | undefined> {
        return this.validate<IResponseSuccess>(data, ResponseResolveValidator)
    }

    async validateResponse(data: any): Promise<IResponseReject | IResponseSuccess | undefined> {
        return await this.validateResponseReject(data) || await this.validateResponseSuccess(data);
    }

    async validateRequest(data: any): Promise<IRequest | undefined> {
        return this.validate<IRequest>(data, RequestValidator);
    }
}

