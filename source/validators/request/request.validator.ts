import { Equals, IsArray, IsDefined, IsString, IsUUID } from 'class-validator';
import { IRequest } from '../interfaces/request.interfaces';

export class RequestValidator implements IRequest {
    @IsDefined()
    @IsString()
    @IsUUID(4)
    id!: string;
    @IsDefined()
    @IsString()
    @Equals('2.0')
    jsonrpc!: "2.0";
    @IsDefined()
    @IsString()
    method!: string;
    @IsDefined()
    @IsArray()
    params!: any[];
    @IsDefined()
    @IsString()
    service!: string;

}
