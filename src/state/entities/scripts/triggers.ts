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
import { redirectTo, ROUTE_KEYS } from 'views/routes';

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

export const triggerFetchScriptDetail = (payload: IScriptByNameAndVersionPayload, redirectTo404?: boolean) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scriptDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        onFail: ({ error }) => {
            if (error.status === 404 && redirectTo404) {
                console.log(redirectTo404);
                redirectTo({
                    routeKey: ROUTE_KEYS.R_NOT_FOUND,
                });
            }
        },
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
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.script.create',
                type: 'success',
            }));
        },
        onFail: ({ dispatch, error }) => {
            let message = 'Unknown error';
            if (error.status) {
                switch (error.status) {
                    case 404:
                        triggerUpdateScriptDetail(payload as IScriptBase);
                        return;
                    case -1:
                        message = 'Cannot connect to the server';
                        break;
                    default:
                        message = error.response?.message;
                        break;
                }
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.script.error',
                    translationPlaceholders: {
                        message,
                    },
                    type: 'error',
                }));
            }
        },
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
