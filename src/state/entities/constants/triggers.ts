import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';

export const triggerFetchActionTypes = () => {
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        itself: triggerFetchActionTypes,
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.actionTypes,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => ({}),
        notificationsToTrigger: [StateChangeNotification.CONSTANTS_ACTION_TYPES],
    });
};

export const triggerFetchConnectionTypes = () => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.connectionTypes,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => ({}),
    notificationsToTrigger: [StateChangeNotification.CONSTANTS_CONNECTION_TYPES],
    itself: triggerFetchConnectionTypes,
});

export const triggerFetchComponentTypes = () => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.componentTypes,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => ({}),
    notificationsToTrigger: [StateChangeNotification.CONSTANTS_COMPONENT_TYPES],
    itself: triggerFetchComponentTypes,
});
