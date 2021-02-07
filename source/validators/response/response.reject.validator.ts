import { IResponseError, IResponseReject } from "../interfaces/response.interfaces";
import { Equals, IsDefined, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ResponseErrorValidator } from "./response.error.validator";

export class ResponseRejectValidator implements IResponseReject {
    @IsDefined()
    @ValidateNested()
    @Type(() => ResponseErrorValidator)
    error!: IResponseError;
    @IsDefined()
    @IsString()
    @IsUUID(4)
    id!: string;
    @IsDefined()
    @IsString()
    @Equals('2.0')
    jsonrpc!: "2.0";
}
