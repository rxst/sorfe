export interface IJsonRpcRequest {
    jsonrpc: '2.0';
    method: string;
    params: object;
    id: string;
}

export interface IJsonRpcResponseSuccess {
    jsonrpc: '2.0';
    result?: any;
    id: string;
}

export interface IJsonRpcResponseReject {
    jsonrpc: '2.0';
    id: string;
    error: IJsonRpcError;
}

export interface IJsonRpcError {
    code: number;
    message: string;
    data: string
}
