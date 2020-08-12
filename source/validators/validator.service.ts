import { Validator } from "class-validator";
import { ClassType } from "class-transformer/ClassTransformer";
import { plainToClass } from "class-transformer";
import { IJsonRpcRequest, IJsonRpcResponseReject, IJsonRpcResponseSuccess } from "../interfaces/ipc.interfaces";
import { JsonRpcRequest, JsonRpcResponseReject, JsonRpcResponseSuccess } from "./json-rpc.class.validator";

export class IPCValidator {
    private validator: Validator = new Validator();

    constructor() {
    }

    public validateData<T>(data: any, classValidator: ClassType<T>): T | undefined {
        const dataCls = plainToClass<T, any>(classValidator, [data]).pop();
        const validationErrors = this.validator.validateSync(dataCls);

        return validationErrors.length === 0 ? dataCls : undefined;
    }

    public validateRequest(data: any): IJsonRpcRequest | false {
        const rpsRequestCls = this.validateData<IJsonRpcRequest>(data, JsonRpcRequest);
        return !!rpsRequestCls ? rpsRequestCls : false;
    }

    public validateResponse(data: any): IJsonRpcResponseReject | IJsonRpcResponseSuccess {
        const rpsResponseClsSuccess = this.validateData<IJsonRpcResponseSuccess>(data, JsonRpcResponseSuccess);
        const rpsResponseClsReject = this.validateData<IJsonRpcResponseReject>(data, JsonRpcResponseReject);
        return !!rpsResponseClsSuccess || !!rpsResponseClsReject ? data : undefined;
    }
}
