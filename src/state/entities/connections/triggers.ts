import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { triggerFlashMessage } from 'state/ui/actions';
import { IConnectionEntity } from 'models/state/connections.model';

export const triggerUpdateConnection = (payload: IConnectionEntity) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.connections,
            updateDataOnSuccess: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.connection_successfully_updated',
                translationPlaceholders: {
                    connectionName: payload.name,
                },
                type: 'success',
            }));
        },
        onFail: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.connection_unknown_error',
                translationPlaceholders: {
                    connectionName: payload.name,
                },
                type: 'error',
            }));
        },
    });

export const triggerCreateConnection = (payload: IConnectionEntity) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.connections,
            updateDataOnSuccess: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.connection_successfully_created',
                type: 'success',
            }));
        },
        onFail: () => {
            triggerUpdateConnection(payload);
        },
    });
