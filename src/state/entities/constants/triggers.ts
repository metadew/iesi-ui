import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';

export const triggerFetchActionTypes = () => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.actionTypes,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => ({}),
    notificationsToTrigger: [StateChangeNotification.CONSTANTS_ACTION_TYPES],
});
