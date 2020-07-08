import initAsyncEntitiesConfigManager
    from 'snipsonian/observable-state/src/actionableStore/entities/initAsyncEntitiesConfigManager';
import { IExtraProcessInput, IState } from 'models/state.models';
import { ITraceableApiError } from 'models/api.models';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { api } from 'api';
import { ICreateExecutionRequestPayload } from 'models/state/executionRequests.models';
import { IScriptByNameAndVersionPayload } from 'models/state/scripts.models';

// eslint-disable-next-line max-len
const entitiesConfigManager = initAsyncEntitiesConfigManager<IState, {}, ITraceableApiError, string, IExtraProcessInput>();

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.scripts,
    operationsConfig: {
        fetch: {
            api: api.scripts.fetchScripts,
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
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequests,
    operationsConfig: {
        fetch: {
            api: api.executionRequests.fetchExecutionRequests,
        },
    },
});

entitiesConfigManager.register({
    asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequestDetail,
    operationsConfig: {
        create: {
            api: api.executionRequests.createExecutionRequest,
            apiInputSelector: ({ extraInput }) => extraInput as ICreateExecutionRequestPayload,
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

export default entitiesConfigManager;
