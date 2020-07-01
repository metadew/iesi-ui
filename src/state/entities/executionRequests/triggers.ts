import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { ICreateExecutionRequestPayload } from 'models/state/executionRequests.models';
import { StateChangeNotification } from 'models/state.models';

// eslint-disable-next-line
export const triggerCreateExecutionRequest = (payload: ICreateExecutionRequestPayload) => entitiesStateManager.triggerAsyncEntityCreate<{}>({
    asyncEntityToCreate: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequests,
    },
    extraInputSelector: () => payload,
    notificationsToTrigger: [StateChangeNotification.EXECUTION_REQUESTS_CREATE],
});
