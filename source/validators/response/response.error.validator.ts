import { IResponseError } from "../interfaces/response.interfaces";
import { IsDefined, IsNumber, IsString } from "class-validator";

export class ResponseErrorValidator implements IResponseError {
    @IsDefined()
    @IsNumber()
    code!: number;
    @IsDefined()
    data!: Error;
    @IsDefined()
    @IsString()
    message!: string;

}
