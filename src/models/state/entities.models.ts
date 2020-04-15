import { IAsyncEntity } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { ITraceableApiError } from 'models/api.models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomAsyncEntity<Data> extends IAsyncEntity<Data, ITraceableApiError> {}

export enum ASYNC_ENTITY_KEYS {
    environments = 'environments',
    environmentDetail = 'environmentDetail',

    connections = 'connections',
    connectionDetail = 'connectionDetail',

    components = 'components',
    componentDetail = 'componentDetail',

    scripts = 'scripts',
    scriptDetail = 'scriptDetail',

    scriptReports = 'scriptReports',
    scriptReportDetail = 'scriptReportDetail',
}
