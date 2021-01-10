export interface IRequest {
    jsonrpc: '2.0';
    id: string;
    service: string;
    method: string;
    params: any[]
}
