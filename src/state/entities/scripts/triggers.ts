import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import {
    IFetchScriptsOptions,
    IScriptByNameAndVersionPayload,
    IScriptBase,
} from 'models/state/scripts.models';
import { StateChangeNotification } from 'models/state.models';
import isSet from '@snipsonian/core/es/is/isSet';
import { triggerFlashMessage } from 'state/ui/actions';

export const triggerFetchScripts = (filter: IFetchScriptsOptions = {}) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scripts,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => (isSet(filter) ? filter : {}),
        notificationsToTrigger: [StateChangeNotification.DESIGN_SCRIPTS_LIST],
        onSuccess: ({ dispatch }) => dispatch(triggerFlashMessage({
            translationKey: 'Fetched scripts',
            type: 'success',
        })),
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

export const triggerUpdateScriptDetail = (payload: IScriptBase) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_SCRIPTS_DETAIL],
    });

export const triggerCreateScriptDetail = (payload: IScriptBase) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_SCRIPTS_DETAIL],
    });

export const triggerDeleteScriptDetail = (payload: IScriptByNameAndVersionPayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_SCRIPTS_DETAIL],
    });
