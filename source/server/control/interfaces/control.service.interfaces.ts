import { Class, ICommonClass } from "../../executor/interfaces/executor.interfaces";

export interface IControlServiceOptions<T> {
    services: Class<ICommonClass>[],
    transport: Class<T>
}
