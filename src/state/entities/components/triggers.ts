import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { handleComponent, triggerFlashMessage } from 'state/ui/actions';
import { IComponentEntity } from 'models/state/components.model';

export const triggerUpdateComponent = (payload: IComponentEntity) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.components,
            updateDataOnSuccess: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.component_successfully_updated',
                translationPlaceholders: {
                    componentName: payload.name,
                },
                type: 'success',
            }));
            dispatch(handleComponent({ currentComponent: payload }));
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
export const triggerCreateComponent = (payload: IComponentEntity) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.components,
            updateDataOnSuccess: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.component_successfully_created',
                translationPlaceholders: {
                    componentName: payload.name,
                },
                type: 'success',
            }));
            dispatch(handleComponent({ currentComponent: payload }));
        },
        onFail: ({ dispatch, error }) => {
            let message = 'Unknown error';
            if (error.status) {
                switch (error.status) {
                    case 404:
                        triggerUpdateComponent(payload);
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
