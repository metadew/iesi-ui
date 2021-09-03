import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import {
    IScriptByNameAndVersionPayload,
    IScriptBase,
    IScriptImport,
    IFetchScriptsListPayload,
} from 'models/state/scripts.models';
import { StateChangeNotification } from 'models/state.models';
import { triggerFlashMessage } from 'state/ui/actions';

export const triggerFetchScripts = (payload: IFetchScriptsListPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scripts,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => payload,
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

export const triggerUpdateScriptDetail = (payload: IScriptBase) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_SCRIPTS_DETAIL],
        onFail: ({ dispatch }) => dispatch(triggerFlashMessage({
            translationKey: 'scripts.detail.error.save',
            type: 'error',
        })),
    });

export const triggerCreateScriptDetail = (payload: IScriptBase | IScriptImport) =>
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

export const triggerExportScriptDetail = (payload: IScriptByNameAndVersionPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetailExport,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_SCRIPTS_DETAIL],
    });
