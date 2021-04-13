import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { triggerFlashMessage, handleConnection } from 'state/ui/actions';
import { IConnectionEntity } from 'models/state/connections.model';

export const triggerUpdateConnection = (payload: IConnectionEntity | IConnectionEntity[], bulk?: boolean) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.connections,
            updateDataOnSuccess: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
        bulk,
        onSuccess: ({ dispatch, currentEntity }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.connection_successfully_updated',
                translationPlaceholders: {
                    connectionName: currentEntity
                        ? (currentEntity as IConnectionEntity).name
                        : (payload as IConnectionEntity).name,
                },
                type: 'success',
            }));
            dispatch(handleConnection({
                currentConnection: currentEntity
                    ? currentEntity as IConnectionEntity
                    : payload as IConnectionEntity,
            }));
        },
        onFail: ({ dispatch, error }) => {
            if (error.status) {
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.common.responseError',
                    translationPlaceholders: {
                        message: error.response?.message,
                    },
                    type: 'error',
                }));
            }
        },
    });

export const triggerCreateConnection = (payload: IConnectionEntity | IConnectionEntity[], bulk?: boolean) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.connections,
            updateDataOnSuccess: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
        bulk,
        onSuccess: ({ dispatch, currentEntity }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.connection_successfully_created',
                type: 'success',
            }));
            dispatch(handleConnection({
                currentConnection: currentEntity
                    ? currentEntity as IConnectionEntity
                    : payload as IConnectionEntity,
            }));
        },
        onFail: ({ dispatch, error }) => {
            let message = 'Unknown error';
            if (error.status) {
                switch (error.status) {
                    case 404:
                        triggerUpdateConnection(payload);
                        return;
                    case -1:
                        message = 'Cannot connect to the server';
                        break;
                    default:
                        message = error.response?.message;
                        break;
                }
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.common.responseError',
                    translationPlaceholders: {
                        message,
                    },
                    type: 'error',
                }));
            }
        },
    });
