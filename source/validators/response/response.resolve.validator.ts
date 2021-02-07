import { IResponseSuccess } from "../interfaces/response.interfaces";
import { Equals, IsArray, IsDefined, IsOptional, IsString, IsUUID } from "class-validator";

export class ResponseResolveValidator implements IResponseSuccess {
    @IsDefined()
    @IsString()
    @IsUUID(4)
    id!: string;
    @IsDefined()
    @IsString()
    @Equals('2.0')
    jsonrpc!: "2.0";
    @IsOptional()
    result!: any;
}
