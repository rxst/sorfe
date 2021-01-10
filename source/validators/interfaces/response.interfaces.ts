export interface IResponseSuccess {
    jsonrpc: '2.0';
    id: string;
    result: any;
}

export interface IResponseReject {
    jsonrpc: '2.0';
    id: string;
    error: IResponseError;
}

export interface IResponseError {
    code: number;
    message: string;
    data: Error
}
