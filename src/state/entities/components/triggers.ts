import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { triggerFlashMessage } from 'state/ui/actions';
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
        },
        onFail: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.component_unknown_error',
                translationPlaceholders: {
                    componentName: payload.name,
                },
                type: 'error',
            }));
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
        },
        onFail: () => {
            triggerUpdateComponent(payload);
        },
    });
