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
    IScriptByNameAndVersionPayload,
    IScriptBase,
    IFetchScriptsListPayload,
    IScriptImport,
} from 'models/state/scripts.models';
import { IOpenAPI } from 'models/state/openapi.model';
import {
    IConnection,
    IConnectionByNamePayload,
    IFetchConnectionsListPayload,
} from 'models/state/connections.model';
import {
    IComponent,
    IComponentByNameAndVersionPayload,
    IFetchComponentsListPayload,
} from 'models/state/components.model';
import { IDataset, IDatasetBase, IDatasetImplementationsByUuidPayload } from 'models/state/datasets.model';

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
    asyncEntityKey: ASYNC_ENTITY_KEYS.environments,
    operationsConfig: {
        fetch: {
            api: api.environments.fetchEnvironments,
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
            api: api.datasets.updateDataset,
            apiInputSelector: ({ extraInput }) => extraInput as IDataset,
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

export default entitiesConfigManager;
