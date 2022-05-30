import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import { triggerFlashMessage } from 'state/ui/actions';
import { ITemplateBase, ITemplateByNamePayload } from 'models/state/templates.models';

export const triggerFetchTemplates = (filter: object = {}) => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.templates,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => filter,
    notificationsToTrigger: [StateChangeNotification.TEMPLATES],
});

export const triggerFetchTemplate = (payload: ITemplateByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.templateDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.TEMPLATE_DETAIL],
    });

export const triggerDeleteTemplateDetail = (payload: ITemplateByNamePayload) =>
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
                translationKey: 'flash_messages.environment.edit',
                translationPlaceholders: {
                    name: (currentEntity as ITemplateBase).name,
                },
            }),
        ),
        onFail: ({ dispatch }) => dispatch(
            triggerFlashMessage({
                type: 'error',
                translationKey: 'flash_messages.common.responseError',
            }),
        ),
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
                translationKey: 'flash_messages.environment.create',
                translationPlaceholders: {
                    name: (currentEntity as ITemplateBase).name,
                },
            }),
        ),
        onFail: ({ dispatch }) => dispatch(
            triggerFlashMessage({
                type: 'error',
                translationKey: 'flash_messages.common.responseError',
            }),
        ),
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.TEMPLATE_DETAIL],
    });
