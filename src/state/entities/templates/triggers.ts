import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import { triggerFlashMessage } from 'state/ui/actions';
import {
    IFetchTemplatesListPayload,
    ITemplateBase,
    ITemplateByNameAndVersionPayload,
} from 'models/state/templates.model';

// eslint-disable-next-line max-len
export const triggerFetchTemplates = (payload: IFetchTemplatesListPayload) => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.templates,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => payload,
    notificationsToTrigger: [StateChangeNotification.TEMPLATES],
});

export const triggerFetchTemplate = (payload: ITemplateByNameAndVersionPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.templateDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.TEMPLATE_DETAIL],
    });

export const triggerDeleteTemplateDetail = (payload: ITemplateByNameAndVersionPayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.templateDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.TEMPLATE_DETAIL],
    });

export const triggerUpdateTemplateDetail = (payload: ITemplateBase) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.templateDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch, currentEntity }) => dispatch(
            triggerFlashMessage({
                type: 'success',
                translationKey: 'flash_messages.templates.update',
                translationPlaceholders: {
                    name: (currentEntity as ITemplateBase).name,
                },
            }),
        ),
        onFail: ({ dispatch, error }) => {
            if (error.status) {
                dispatch(

                    triggerFlashMessage({
                        type: 'error',
                        translationKey: 'flash_messages.common.responseError',
                        translationPlaceholders: {
                            message: error.response?.message,
                        },
                    }),
                );
            } else {
                dispatch(

                    triggerFlashMessage({
                        type: 'error',
                        translationKey: 'flash_messages.templates.error',
                    }),
                );
            }
        },
        notificationsToTrigger: [StateChangeNotification.TEMPLATE_DETAIL],
    });

export const triggerCreateTemplateDetail = (payload: ITemplateBase) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.templateDetail,
        },
        onSuccess: ({ dispatch, currentEntity }) => dispatch(
            triggerFlashMessage({
                type: 'success',
                translationKey: 'flash_messages.templates.create',
                translationPlaceholders: {
                    name: (currentEntity as ITemplateBase).name,
                },
            }),
        ),
        onFail: ({ dispatch, error }) => {
            if (error.status) {
                dispatch(

                    triggerFlashMessage({
                        type: 'error',
                        translationKey: 'flash_messages.common.responseError',
                        translationPlaceholders: {
                            message: error.response?.message,
                        },
                    }),
                );
            } else {
                dispatch(

                    triggerFlashMessage({
                        type: 'error',
                        translationKey: 'flash_messages.templates.error',
                    }),
                );
            }
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.TEMPLATE_DETAIL],
    });
