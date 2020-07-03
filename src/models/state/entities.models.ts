import { IEnvironment } from 'models/state/environments.models';
import { IAsyncEntity } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { ITraceableApiError } from 'models/api.models';
import { IScriptBase, IScript } from 'models/state/scripts.models';
import { IExecutionRequest } from './executionRequests.models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomAsyncEntity<Data> extends IAsyncEntity<Data, ITraceableApiError> {}

/* Keep in sync with the keys of IEntitiesState !! */
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

    executionRequests = 'executionRequests',
}

/* Keep the keys in sync with ASYNC_ENTITY_KEYS !! */
export interface IEntitiesState {
    scripts: ICustomAsyncEntity<IScriptBase[]>;
    scriptDetail: ICustomAsyncEntity<IScript>;
    executionRequests: ICustomAsyncEntity<IExecutionRequest[]>;
    environments: ICustomAsyncEntity<IEnvironment[]>;
}
