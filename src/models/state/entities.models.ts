import { IScriptExecutionDetail } from 'models/state/scriptExecutions.models';
import { IEnvironment } from 'models/state/environments.models';
import { IAsyncEntity } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { ITraceableApiError } from 'models/api.models';
import { IScript, IScriptsEntity } from 'models/state/scripts.models';
import { ITemplate, ITemplateEntity } from 'models/state/templates.model';
import { IExecutionRequest, IExecutionRequestsEntity } from './executionRequests.models';
import { IActionType, IComponentType, IConnectionType } from './constants.models';
import { IOpenAPIEntity } from './openapi.model';
import { IComponent, IComponentEntity } from './components.model';
import { IConnectionEntity, IConnection } from './connections.model';
import { IDataset, IDatasetEntity, IDatasetImplementation } from './datasets.model';
import { IUser, IUserEntity } from './user.model';
import { ITeam, ITeamEntity } from './team.model';
import { ISecurityGroup, ISecurityGroupEntity } from './securityGroups.model';
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
    scriptDetailImport = 'scriptDetailImport',

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

    authentication = 'authentication',

    datasets = 'datasets',
    datasetDetail = 'datasetDetail',
    datasetDetailExport = 'datasetDetailExport',
    datasetDetailImport = 'datasetDetailImport',
    datasetImplementations = 'datasetImplementations',

    users = 'users',
    userDetail = 'userDetail',
    userDetailRole = 'userDetailRole',

    teams = 'teams',
    teamDetail = 'teamDetail',
    teamDetailSecurityGroup = 'teamDetailSecurityGroup',

    securityGroups = 'securityGroups',
    securityGroupDetail = 'securityGroupDetail',

    templates = 'templates',
    templateDetail = 'templateDetail'
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
    scriptDetailImport: ICustomAsyncEntity<IScript>;
    components: ICustomAsyncEntity<IComponentEntity>;
    componentDetail: ICustomAsyncEntity<IComponent>;
    connections: ICustomAsyncEntity<IConnectionEntity>;
    connectionDetail: ICustomAsyncEntity<IConnection>;
    datasets: ICustomAsyncEntity<IDatasetEntity>;
    datasetDetail: ICustomAsyncEntity<IDataset>;
    datasetDetailExport: ICustomAsyncEntity<IDataset>;
    datasetDetailImport: ICustomAsyncEntity<IDataset>;
    datasetImplementations: ICustomAsyncEntity<IDatasetImplementation[]>;
    executionRequests: ICustomAsyncEntity<IExecutionRequestsEntity>;
    executionRequestDetail: ICustomAsyncEntity<IExecutionRequest>;
    scriptExecutionDetail: ICustomAsyncEntity<IScriptExecutionDetail>;
    users: ICustomAsyncEntity<IUserEntity>;
    userDetail: ICustomAsyncEntity<IUser>;
    userDetailRole: ICustomAsyncEntity<IUser>;
    teams: ICustomAsyncEntity<ITeamEntity>;
    teamDetail: ICustomAsyncEntity<ITeam>;
    teamDetailSecurityGroup: ICustomAsyncEntity<ISecurityGroup>;
    securityGroups: ICustomAsyncEntity<ISecurityGroupEntity>;
    securityGroupDetail: ICustomAsyncEntity<ISecurityGroup>;
    templates: ICustomAsyncEntity<ITemplateEntity>;
    templateDetail: ICustomAsyncEntity<ITemplate>;
    openapi: ICustomAsyncEntity<IOpenAPIEntity>;
}
