import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { handleComponent, triggerFlashMessage } from 'state/ui/actions';
import {
    IComponent,
    IComponentByNameAndVersionPayload,
    IFetchComponentsListPayload,
} from 'models/state/components.model';
import { StateChangeNotification } from 'models/state.models';

export const triggerFetchComponents = (payload: IFetchComponentsListPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.components,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_COMPONENTS_LIST],
    });
export const triggerFetchComponentDetail = (payload: IComponentByNameAndVersionPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        onFail: ({ dispatch, error }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.common.error',
                translationPlaceholders: {
                    error: error?.messsage,
                },
                type: 'error'
            }))
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_COMPONENT_DETAIL],
    });

export const triggerCreateComponentDetail = (payload: IComponent) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_COMPONENT_DETAIL],
    });

export const triggerUpdateComponentDetail = (payload: IComponent) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_COMPONENT_DETAIL],
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.component.edit',
                type: 'success',
            }));
        },
        onFail: ({ dispatch }) => dispatch(triggerFlashMessage({
            translationKey: 'flash_messages.error',
            type: 'error',
        })),
    });
export const triggerDeleteComponentDetail = (payload: IComponentByNameAndVersionPayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.componentDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DESIGN_COMPONENT_DETAIL],
    });
export const triggerUpdateComponent = (payload: IComponent | IComponent[], bulk?: boolean) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.openapiComponents,
            updateDataOnSuccess: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
        bulk,
        onSuccess: ({ dispatch, currentEntity }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.component_successfully_updated',
                translationPlaceholders: {
                    componentName: currentEntity
                        ? (currentEntity as IComponent).name
                        : (payload as IComponent).name,
                },
                type: 'success',
            }));
            dispatch(handleComponent({
                currentComponent: currentEntity
                    ? currentEntity as IComponent
                    : payload as IComponent,
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
export const triggerCreateComponent = (payload: IComponent | IComponent[], bulk?: boolean) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.openapiComponents,
            updateDataOnSuccess: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
        bulk,
        onSuccess: ({ dispatch, currentEntity }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.openapi.component_successfully_created',
                translationPlaceholders: {
                    componentName: currentEntity
                        ? (currentEntity as IComponent).name
                        : (payload as IComponent).name,
                },
                type: 'success',
            }));
            dispatch(handleComponent({
                currentComponent: currentEntity
                    ? currentEntity as IComponent
                    : payload as IComponent,
            }));
        },
        onFail: ({ dispatch, error }) => {
            let message = 'Unknown error';
            if (error.status) {
                switch (error.status) {
                    case 404:
                        triggerUpdateComponent(payload, bulk);
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
