import { IScriptExecutionDetail } from 'models/state/scriptExecutions.models';
import { IEnvironment } from 'models/state/environments.models';
import { IAsyncEntity } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { ITraceableApiError } from 'models/api.models';
import { IScript, IScriptsEntity } from 'models/state/scripts.models';
import { IExecutionRequest, IExecutionRequestsEntity } from './executionRequests.models';
import { IActionType } from './constants.models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomAsyncEntity<Data> extends IAsyncEntity<Data, ITraceableApiError> {}

/* Keep in sync with the keys of IEntitiesState !! */
export enum ASYNC_ENTITY_KEYS {
    actionTypes = 'actionTypes',

    environments = 'environments',
    environmentDetail = 'environmentDetail',

    connections = 'connections',
    connectionDetail = 'connectionDetail',

    components = 'components',
    componentDetail = 'componentDetail',

    scripts = 'scripts',
    scriptDetail = 'scriptDetail',

    executionRequests = 'executionRequests',
    executionRequestDetail = 'executionRequestDetail',

    scriptExecutionDetail = 'scriptExecutionDetail',
}

/* Keep the keys in sync with ASYNC_ENTITY_KEYS !! */
export interface IEntitiesState {
    actionTypes: ICustomAsyncEntity<IActionType[]>;
    environments: ICustomAsyncEntity<IEnvironment[]>;
    scripts: ICustomAsyncEntity<IScriptsEntity>;
    scriptDetail: ICustomAsyncEntity<IScript>;
    executionRequests: ICustomAsyncEntity<IExecutionRequestsEntity>;
    executionRequestDetail: ICustomAsyncEntity<IExecutionRequest>;
    scriptExecutionDetail: ICustomAsyncEntity<IScriptExecutionDetail>;
}
