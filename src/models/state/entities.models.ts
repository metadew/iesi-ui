import { IScriptExecutionDetail } from 'models/state/scriptExecutions.models';
import { IEnvironment } from 'models/state/environments.models';
import { IAsyncEntity } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { ITraceableApiError } from 'models/api.models';
import { IScript, IScriptsEntity } from 'models/state/scripts.models';
import { IExecutionRequest, IExecutionRequestsEntity } from './executionRequests.models';
import { IActionType, IComponentType, IConnectionType } from './constants.models';
import { IOpenAPIEntity } from './openapi.model';
import { IComponent, IComponentEntity } from './components.model';
import { IConnectionEntity, IConnection } from './connections.model';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomAsyncEntity<Data> extends IAsyncEntity<Data, ITraceableApiError> {}

/* Keep in sync with the keys of IEntitiesState !! */
export enum ASYNC_ENTITY_KEYS {
    actionTypes = 'actionTypes',
    connectionTypes = 'connectionTypes',
    componentTypes = 'componentTypes',

    environments = 'environments',
    environmentDetail = 'environmentDetail',

    connections = 'connections',
    connectionDetail = 'connectionDetail',

    scripts = 'scripts',
    scriptDetail = 'scriptDetail',
    scriptDetailExport = 'scriptDetailExport',

    components = 'components',
    componentDetail = 'componentDetail',

    executionRequests = 'executionRequests',
    executionRequestDetail = 'executionRequestDetail',

    scriptExecutionDetail = 'scriptExecutionDetail',

    openapi = 'openapi',
    openapiComponents = 'openapiComponents',
    openapiComponentDetail = 'openapiComponentDetail',
    openapiConnections = 'openapiConnections',
    openapiConnectionDetail = 'openapiConnectionDetail',

    authentication = 'authentication'
}

/* Keep the keys in sync with ASYNC_ENTITY_KEYS !! */
export interface IEntitiesState {
    actionTypes: ICustomAsyncEntity<IActionType[]>;
    connectionTypes: ICustomAsyncEntity<IConnectionType[]>;
    componentTypes: ICustomAsyncEntity<IComponentType[]>;
    environments: ICustomAsyncEntity<IEnvironment[]>;
    scripts: ICustomAsyncEntity<IScriptsEntity>;
    scriptDetail: ICustomAsyncEntity<IScript>;
    scriptDetailExport: ICustomAsyncEntity<IScript>;
    components: ICustomAsyncEntity<IComponentEntity>;
    componentDetail: ICustomAsyncEntity<IComponent>;
    connections: ICustomAsyncEntity<IConnectionEntity>;
    connectionDetail: ICustomAsyncEntity<IConnection>;
    executionRequests: ICustomAsyncEntity<IExecutionRequestsEntity>;
    executionRequestDetail: ICustomAsyncEntity<IExecutionRequest>;
    scriptExecutionDetail: ICustomAsyncEntity<IScriptExecutionDetail>;
    openapi: ICustomAsyncEntity<IOpenAPIEntity>;
}
