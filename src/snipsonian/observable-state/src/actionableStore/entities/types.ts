import { ITraceableApiErrorBase } from '@snipsonian/core/es/typings/apiErrors';

export type TEntityKey = string;

export interface IEntitiesStateBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [entityKey: string]: IAsyncEntity<any>;
}

/* Keep in sync with fields in IAsyncEntity */
export enum AsyncOperation {
    fetch = 'fetch',
    create = 'create',
    update = 'update',
    remove = 'remove',
}

export interface IAsyncEntity<Data, Error = ITraceableApiErrorBase<{}>> {
    data: Data;
    fetch?: IAsyncEntityOperation<Error>;
    create?: IAsyncEntityOperation<Error>;
    update?: IAsyncEntityOperation<Error>;
    remove?: IAsyncEntityOperation<Error>;
}

export interface IAsyncEntityOperation<Error = ITraceableApiErrorBase<{}>> {
    status: AsyncStatus;
    error: Error;
}

export enum AsyncStatus {
    Initial = 'initial',
    Busy = 'busy',
    Success = 'success',
    Error = 'error',
}
