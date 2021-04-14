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
} from 'models/state/scripts.models';
import { IOpenAPI } from 'models/state/openapi.model';
import { IConnectionEntity } from 'models/state/connections.model';
import { IComponentEntity } from 'models/state/components.model';

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
            apiInputSelector: ({ extraInput }) => extraInput as IScriptBase,
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
    asyncEntityKey: ASYNC_ENTITY_KEYS.openapi,
    operationsConfig: {
        create: {
            api: api.openapi.transformDocumentation,
            apiInputSelector: ({ extraInput }) => extraInput as IOpenAPI,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.connections,
    operationsConfig: {
        create: {
            api: api.connections.createConnection,
            apiInputSelector: ({ extraInput }) => extraInput as IConnectionEntity,
        },
        update: {
            api: api.connections.updateConnection,
            apiInputSelector: ({ extraInput }) => extraInput as IConnectionEntity,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.components,
    operationsConfig: {
        create: {
            api: api.components.createComponent,
            apiInputSelector: ({ extraInput }) => extraInput as IComponentEntity,
        },
        update: {
            api: api.components.updateComponent,
            apiInputSelector: ({ extraInput }) => extraInput as IComponentEntity,
        },
    },
});

export default entitiesConfigManager;
