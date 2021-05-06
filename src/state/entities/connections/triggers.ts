import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { triggerFlashMessage, handleConnection } from 'state/ui/actions';
import {
    IConnection,
    IConnectionByNameAndEnvironmentPayload,
    IFetchConnectionsListPayload,
} from 'models/state/connections.model';
import { StateChangeNotification } from 'models/state.models';

export const triggerFetchConnections = (payload: IFetchConnectionsListPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.connections,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_CONNECTIONS_LIST],
    });

export const triggerDeleteConnectionDetail = (payload: IConnectionByNameAndEnvironmentPayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.connectionDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_CONNECTION_DETAIL],
    });

export const triggerUpdateConnection = (payload: IConnection | IConnection[], bulk?: boolean) =>
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
                        ? (currentEntity as IConnection).name
                        : (payload as IConnection).name,
                },
                type: 'success',
            }));
            dispatch(handleConnection({
                currentConnection: currentEntity
                    ? currentEntity as IConnection
                    : payload as IConnection,
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

export const triggerCreateConnection = (payload: IConnection | IConnection[], bulk?: boolean) =>
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
                    ? currentEntity as IConnection
                    : payload as IConnection,
            }));
        },
        onFail: ({ dispatch, error }) => {
            let message = 'Unknown error';
            if (error.status) {
                switch (error.status) {
                    case 404:
                        triggerUpdateConnection(payload, bulk);
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
