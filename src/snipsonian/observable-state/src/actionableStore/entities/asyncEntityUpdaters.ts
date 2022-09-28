import { ITraceableApiErrorBase } from '@snipsonian/core/es/typings/apiErrors';
import { AsyncOperation, AsyncStatus, IAsyncEntity } from './types';

interface IAsyncEntityUpdater {
    trigger<Data, Error>(entity: IAsyncEntity<Data, Error>, initialData: Data): IAsyncEntity<Data, Error>;
    triggerWithoutDataReset<Data, Error>(entity: IAsyncEntity<Data, Error>): IAsyncEntity<Data, Error>;
    succeeded<Data, Error>(entity: IAsyncEntity<Data, Error>, data: Data): IAsyncEntity<Data, Error>;
    succeededWithoutDataSet<Data, Error>(entity: IAsyncEntity<Data, Error>): IAsyncEntity<Data, Error>;
    failed<Data, Error>(entity: IAsyncEntity<Data, Error>, error: Error): IAsyncEntity<Data, Error>;
    cancel<Data, Error>(entity: IAsyncEntity<Data, Error>): IAsyncEntity<Data, Error>;
    reset<Data, Error>(entity: IAsyncEntity<Data, Error>, initialData: Data): IAsyncEntity<Data, Error>;
    resetWithoutDataReset<Data, Error>(entity: IAsyncEntity<Data, Error>): IAsyncEntity<Data, Error>;
}

export const asyncEntityFetch = initAsyncEntityUpdaters(AsyncOperation.fetch);
export const asyncEntityCreate = initAsyncEntityUpdaters(AsyncOperation.create);
export const asyncEntityUpdate = initAsyncEntityUpdaters(AsyncOperation.update);
export const asyncEntityRemove = initAsyncEntityUpdaters(AsyncOperation.remove);

function initAsyncEntityUpdaters(operation: AsyncOperation): IAsyncEntityUpdater {
    return {
        trigger<Data, Error = ITraceableApiErrorBase<{}>>(
            entity: IAsyncEntity<Data, Error>,
            initialData: Data,
        ): IAsyncEntity<Data, Error> {
            return {
                ...entity,
                data: initialData,
                [operation]: {
                    status: AsyncStatus.Busy,
                    error: null,
                },
            };
        },
        triggerWithoutDataReset<Data, Error = ITraceableApiErrorBase<{}>>(
            entity: IAsyncEntity<Data, Error>,
        ): IAsyncEntity<Data, Error> {
            return {
                ...entity,
                [operation]: {
                    status: AsyncStatus.Busy,
                    error: null,
                },
            };
        },
        succeeded<Data, Error = ITraceableApiErrorBase<{}>>(
            entity: IAsyncEntity<Data, Error>,
            data: Data,
        ): IAsyncEntity<Data, Error> {
            return {
                ...entity,
                data,
                [operation]: {
                    status: AsyncStatus.Success,
                    error: null,
                },
            };
        },
        succeededWithoutDataSet<Data, Error = ITraceableApiErrorBase<{}>>(
            entity: IAsyncEntity<Data, Error>,
        ): IAsyncEntity<Data, Error> {
            return {
                ...entity,
                [operation]: {
                    status: AsyncStatus.Success,
                    error: null,
                },
            };
        },
        failed<Data, Error = ITraceableApiErrorBase<{}>>(
            entity: IAsyncEntity<Data, Error>,
            error: Error,
        ): IAsyncEntity<Data, Error> {
            return {
                ...entity,
                [operation]: {
                    status: AsyncStatus.Error,
                    error,
                },
            };
        },
        cancel<Data, Error = ITraceableApiErrorBase<{}>>(
            entity: IAsyncEntity<Data, Error>,
        ): IAsyncEntity<Data, Error> {
            return {
                ...entity,
                [operation]: {
                    ...entity[operation],
                    status: AsyncStatus.Initial,
                },
            };
        },
        reset<Data, Error = ITraceableApiErrorBase<{}>>(
            entity: IAsyncEntity<Data, Error>,
            initialData: Data,
        ): IAsyncEntity<Data, Error> {
            return {
                ...entity,
                data: initialData,
                [operation]: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            };
        },
        resetWithoutDataReset<Data, Error = ITraceableApiErrorBase<{}>>(
            entity: IAsyncEntity<Data, Error>,
        ): IAsyncEntity<Data, Error> {
            return {
                ...entity,
                [operation]: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            };
        },
    };
}
