import initAsyncEntitiesConfigManager
    from 'snipsonian/observable-state/src/actionableStore/entities/initAsyncEntitiesConfigManager';
import { IExtraProcessInput, IState } from 'models/state.models';
import { ITraceableApiError } from 'models/api.models';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { IScriptExecutionByRunIdAndProcessIdPayload } from 'models/state/scriptExecutions.models';
import { api } from 'api';
import {
    ICreateExecutionRequestPayload,
    IExecutionRequestByIdPayload,
    IFetchExecutionRequestListPayload,
} from 'models/state/executionRequests.models';
import {
    IFetchScriptsListPayload,
    IScriptBase,
    IScriptByNameAndVersionPayload,
    IScriptImport,
} from 'models/state/scripts.models';
import { IOpenAPI } from 'models/state/openapi.model';
import { IConnection, IConnectionByNamePayload, IFetchConnectionsListPayload } from 'models/state/connections.model';
import {
    IComponent,
    IComponentByNameAndVersionPayload,
    IComponentImportPayload,
    IFetchComponentsListPayload,
} from 'models/state/components.model';
import {
    IEnvironment,
    IEnvironmentByNamePayload,
    IFetchEnvironmentsListPayload,
} from 'models/state/environments.models';
import {
    IDataset,
    IDatasetBase,
    IDatasetByNamePayload,
    IDatasetByUuidPayload,
    IDatasetImplementationsByUuidPayload,
    IDatasetImportPayload,
    IFetchDatasetsListPayload,
} from 'models/state/datasets.model';
import {
    IFetchUsersListPayload,
    IUserBase,
    IUserByNamePayload,
    IUserPasswordPostPayload,
    IUserPost,
} from 'models/state/user.model';
import {
    IFetchTeamsListPayload,
    ITeamAssignUserRolePayload,
    ITeamBase,
    ITeamByIdPayload,
    ITeamByNamePayload,
    ITeamDeleteUserRole,
} from 'models/state/team.model';
import {
    IFetchSecurityGroupListPayload,
    ISecurityGroupAssignTeamPayload,
    ISecurityGroupBase,
    ISecurityGroupByNamePayload,
} from 'models/state/securityGroups.model';
import { IImportPayload } from 'models/state/iesiGeneric.models';
import {
    IFetchTemplatesListPayload,
    ITemplateBase,
    ITemplateByNameAndVersionPayload,
} from 'models/state/templates.model';

// eslint-disable-next-line max-len
const entitiesConfigManager = initAsyncEntitiesConfigManager<IState, {}, ITraceableApiError, string, IExtraProcessInput>();

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.scripts,
    operationsConfig: {
        fetch: {
            api: api.scripts.fetchScripts,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchScriptsListPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetail,
    operationsConfig: {
        fetch: {
            api: api.scripts.fetchScriptVersion,
            apiInputSelector: ({ extraInput }) => extraInput as IScriptByNameAndVersionPayload,
        },
        create: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.scripts.createScriptVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IScriptBase | IScriptImport,
        },
        update: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.scripts.updateScriptVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IScriptBase,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.scripts.deleteScriptVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IScriptByNameAndVersionPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetailExport,
    operationsConfig: {
        fetch: {
            api: api.scripts.fetchScriptByNameAndVersionDownload,
            apiInputSelector: ({ extraInput }) => extraInput as IScriptByNameAndVersionPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetailImport,
    operationsConfig: {
        create: {
            api: api.scripts.createScriptVersionImport,
            apiInputSelector: ({ extraInput }) => extraInput as IImportPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequests,
    operationsConfig: {
        fetch: {
            api: api.executionRequests.fetchExecutionRequests,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchExecutionRequestListPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequestDetail,
    operationsConfig: {
        fetch: {
            api: api.executionRequests.fetchExecutionRequest,
            apiInputSelector: ({ extraInput }) => extraInput as IExecutionRequestByIdPayload,
        },
        create: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.executionRequests.createExecutionRequest,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ICreateExecutionRequestPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.scriptExecutionDetail,
    operationsConfig: {
        fetch: {
            api: api.scriptExecutions.fetchScriptExecutionDetail,
            apiInputSelector: ({ extraInput }) => extraInput as IScriptExecutionByRunIdAndProcessIdPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.actionTypes,
    operationsConfig: {
        fetch: {
            api: api.constants.fetchActionTypes,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.connectionTypes,
    operationsConfig: {
        fetch: {
            api: api.constants.fetchConnectionTypes,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.componentTypes,
    operationsConfig: {
        fetch: {
            api: api.constants.fetchComponentTypes,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.components,
    operationsConfig: {
        fetch: {
            api: api.components.fetchComponents,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchComponentsListPayload,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.components.deleteComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponentByNameAndVersionPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetail,
    operationsConfig: {
        fetch: {
            api: api.components.fetchComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponentByNameAndVersionPayload,
        },
        create: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.components.createComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponent,
        },
        update: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.components.updateComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponent,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.components.deleteComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponentByNameAndVersionPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.connections,
    operationsConfig: {
        fetch: {
            api: api.connections.fetchConnections,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchConnectionsListPayload,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.connections.deleteComponentEnvironment,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IConnectionByNamePayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.connectionDetail,
    operationsConfig: {
        fetch: {
            api: api.connections.fetchConnection,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IConnectionByNamePayload,
        },
        create: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.connections.createConnection,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IConnection,
        },
        update: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.connections.updateConnection,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IConnection,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.connections.deleteConnection,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IConnectionByNamePayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.environments,
    operationsConfig: {
        fetch: {
            api: api.environments.fetchEnvironments,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchEnvironmentsListPayload,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.environments.deleteEnvironment,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IEnvironmentByNamePayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.environmentDetail,
    operationsConfig: {
        fetch: {
            api: api.environments.fetchEnvironment,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IEnvironmentByNamePayload,
        },
        create: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.environments.createEnvironment,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IEnvironment,
        },
        update: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.environments.updateEnvironment,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IEnvironment,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.environments.deleteEnvironment,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IEnvironmentByNamePayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.openapi,
    operationsConfig: {
        create: {
            api: api.openapi.transformDocumentation,
            apiInputSelector: ({ extraInput }) => extraInput as IOpenAPI,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.openapiComponents,
    operationsConfig: {
        fetch: {
            api: api.components.fetchComponents,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchComponentsListPayload,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.components.deleteComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponentByNameAndVersionPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetail,
    operationsConfig: {
        fetch: {
            api: api.components.fetchComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponentByNameAndVersionPayload,
        },
        create: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.components.createComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponent,
        },
        update: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.components.updateComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponent,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.components.deleteComponentVersion,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IComponentByNameAndVersionPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetailImport,
    operationsConfig: {
        create: {
            api: api.components.createComponentImport,
            apiInputSelector: ({ extraInput }) => extraInput as IComponentImportPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetailExport,
    operationsConfig: {
        fetch: {
            api: api.components.fetchComponentDownload,
            apiInputSelector: ({ extraInput }) => extraInput as IComponentByNameAndVersionPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.openapiComponents,
    operationsConfig: {
        create: {
            api: api.components.createComponent,
            apiInputSelector: ({ extraInput }) => extraInput as IComponent,
        },
        update: {
            api: api.components.updateComponent,
            apiInputSelector: ({ extraInput }) => extraInput as IComponent,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.openapiConnections,
    operationsConfig: {
        create: {
            api: api.connections.createConnection,
            apiInputSelector: ({ extraInput }) => extraInput as IConnection,
        },
        update: {
            api: api.connections.updateConnection,
            apiInputSelector: ({ extraInput }) => extraInput as IConnection,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.openapiEnvironments,
    operationsConfig: {
        create: {
            api: api.environments.createEnvironment,
            apiInputSelector: ({ extraInput }) => extraInput as IEnvironment,
        },
        update: {
            api: api.environments.updateEnvironment,
            apiInputSelector: ({ extraInput }) => extraInput as IEnvironment,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.datasets,
    operationsConfig: {
        fetch: {
            api: api.datasets.fetchDatasets,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchDatasetsListPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetail,
    operationsConfig: {
        fetch: {
            api: api.datasets.fetchDataset,
            apiInputSelector: ({ extraInput }) => extraInput as IDataset,
        },
        create: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.datasets.createDataset,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IDatasetBase,
        },
        update: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.datasets.updateDataset,
            apiInputSelector: ({ extraInput }) => extraInput as IDataset,
        },
        remove: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.datasets.deleteDataset,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IDatasetByUuidPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetailImport,
    operationsConfig: {
        create: {
            api: api.datasets.createDatasetImport,
            apiInputSelector: ({ extraInput }) => extraInput as IDatasetImportPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetailExport,
    operationsConfig: {
        fetch: {
            api: api.datasets.fetchDatasetDownload,
            apiInputSelector: ({ extraInput }) => extraInput as IDatasetByNamePayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.datasetImplementations,
    operationsConfig: {
        fetch: {
            api: api.datasets.fetchDatasetImplementations,
            apiInputSelector: ({ extraInput }) => extraInput as IDatasetImplementationsByUuidPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.users,
    operationsConfig: {
        fetch: {
            api: api.users.fetchUsers,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchUsersListPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.userDetail,
    operationsConfig: {
        fetch: {
            api: api.users.fetchUser,
            apiInputSelector: ({ extraInput }) => extraInput as IUserByNamePayload,
        },
        create: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.users.createUser,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IUserPost,
        },
        update: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.users.updateUser,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as IUserBase,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.userDetailRole,
    operationsConfig: {
        create: {
            api: api.teams.assignRoleToUser,
            apiInputSelector: ({ extraInput }) => extraInput as ITeamAssignUserRolePayload,
        },
        remove: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.teams.deleteRoleFromUser,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ITeamDeleteUserRole,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.userDetailPassword,
    operationsConfig: {
        update: {
            api: api.users.updatePassword,
            apiInputSelector: ({ extraInput }) => extraInput as IUserPasswordPostPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.teams,
    operationsConfig: {
        fetch: {
            api: api.teams.fetchTeams,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchTeamsListPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.teamDetail,
    operationsConfig: {
        fetch: {
            api: api.teams.fetchTeam,
            apiInputSelector: ({ extraInput }) => extraInput as ITeamByNamePayload,
        },
        create: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.teams.createTeam,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ITeamBase,
        },
        remove: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.teams.deleteTeam,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ITeamByIdPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.teamDetailSecurityGroup,
    operationsConfig: {
        create: {
            api: api.securityGroups.assignTeam,
            apiInputSelector: ({ extraInput }) => extraInput as ISecurityGroupAssignTeamPayload,
            mapApiResponse: ({ response }) => response,
        },
        remove: {
            api: api.securityGroups.unassignTeam,
            apiInputSelector: ({ extraInput }) => extraInput as ISecurityGroupAssignTeamPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.securityGroups,
    operationsConfig: {
        fetch: {
            api: api.securityGroups.fetchSecurityGroups,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchSecurityGroupListPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.securityGroupDetail,
    operationsConfig: {
        fetch: {
            api: api.securityGroups.fetchSecurityGroup,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ISecurityGroupByNamePayload,
        },
        create: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.securityGroups.createSecurityGroup,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ISecurityGroupBase,
        },
        remove: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.securityGroups.deleteSecurityGroup,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ISecurityGroupByIdPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.templates,
    operationsConfig: {
        fetch: {
            api: api.templates.fetchTemplates,
            apiInputSelector: ({ extraInput }) => extraInput as IFetchTemplatesListPayload,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.templates.deleteTemplate,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ITemplateByNameAndVersionPayload,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.templateDetail,
    operationsConfig: {
        fetch: {
            api: api.templates.fetchTemplate,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ITemplateByNamePayload,
        },
        create: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.templates.createTemplate,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ITemplateBase,
        },
        update: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.templates.updateTemplate,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ITemplateBase,
        },
        remove: {
            // TODO IESI-138: Fix operationsConfig typings, this works but errors during typechecking
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            api: api.templates.deleteTemplate,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            apiInputSelector: ({ extraInput }) => extraInput as ITemplateByNameAndVersionPayload,
        },
    },
});

export default entitiesConfigManager;
