import isSet from '@snipsonian/core/es/is/isSet';
import { ITraceableApiErrorBase } from '@snipsonian/core/es/typings/apiErrors';
import { AsyncOperation, AsyncStatus, IAsyncEntity } from './types';

export function createAsyncEntityInitialState<Data = {}, Error = ITraceableApiErrorBase<{}>>({
    data,
    operations = [AsyncOperation.fetch],
}: {
    data?: Data;
    operations?: AsyncOperation[];
} = {}): IAsyncEntity<Data, Error> {
    const baseEntity: IAsyncEntity<Data, Error> = {
        data: isSet(data) ? data : null,
    };

    if (!operations || operations.length === 0) {
        return baseEntity;
    }

    return operations.reduce(
        (accumulator, operation) => ({
            ...accumulator,
            [operation]: {
                status: AsyncStatus.Initial,
                error: null,
            },
        }),
        baseEntity,
    );
}
