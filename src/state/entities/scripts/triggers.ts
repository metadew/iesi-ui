import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { IScriptByNameAndVersionPayload } from 'models/state/scripts.models';
import { StateChangeNotification } from 'models/state.models';

// TODO add filter payload
export const triggerFetchScripts = (filter: object = {}) => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.scripts,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => filter,
    notificationsToTrigger: [StateChangeNotification.DESIGN_SCRIPTS_LIST],
});

export const triggerFetchScriptDetail = (payload: IScriptByNameAndVersionPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_SCRIPTS_DETAIL],
    });
