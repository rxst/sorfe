import {
    Equals, IsArray,
    IsDateString,
    IsDefined, IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import {
    IJsonRpcError,
    IJsonRpcRequest,
    IJsonRpcResponseReject,
    IJsonRpcResponseSuccess
} from '../interfaces/ipc.interfaces';

export class JsonRpcRequest implements IJsonRpcRequest {
    @Equals('2.0')
    @IsString()
    @IsDefined()
    jsonrpc: '2.0';
    @IsString()
    @IsDefined()
    method: string;
    @IsArray()
    @IsOptional()
    params: any[];
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    id: string;
}

export class JsonRpcResponseSuccess implements IJsonRpcResponseSuccess {
    @Equals('2.0')
    @IsString()
    @IsDefined()
    jsonrpc: '2.0';
    @IsDefined()
    result: any;
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    id: string;
}

export class JsonRpcResponseReject implements IJsonRpcResponseReject {
    @Equals('2.0')
    @IsString()
    @IsDefined()
    jsonrpc: '2.0';
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    id: string;
    @IsDefined()
    @ValidateNested()
    @Type(() => JsonRpcError)
    error: JsonRpcError;
}

export class JsonRpcError implements IJsonRpcError {
    @IsNumber()
    @IsDefined()
    code: number;
    @IsString()
    @IsDefined()
    message: string;
    @IsDateString()
    @IsDefined()
    data: string
}
