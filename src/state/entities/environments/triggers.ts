import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import { IEnvironment, IEnvironmentByNamePayload } from 'models/state/environments.models';
import { triggerFlashMessage } from 'state/ui/actions';

export const triggerFetchEnvironments = (filter: object = {}) => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.environments,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => filter,
    notificationsToTrigger: [StateChangeNotification.ENVIRONMENTS],
});

// export const triggerFetchEnvironments = (payload: IFetchEnvironmentsListPayload) =>
//     entitiesStateManager.triggerAsyncEntityFetch<{}>({
//         asyncEntityToFetch: {
//             asyncEntityKey: ASYNC_ENTITY_KEYS.environments,
//             refreshMode: 'always',
//             resetDataOnTrigger: false,
//         },
//         extraInputSelector: () => payload,
//         notificationsToTrigger: [StateChangeNotification.ENVIRONMENTS],
//     });

export const triggerFetchEnvironment = (payload: IEnvironmentByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.environmentDetail,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.ENVIRONMENT_DETAIL],
    });

export const triggerDeleteEnvironmentDetail = (payload: IEnvironmentByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.environmentDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.ENVIRONMENT_DETAIL],
    });

export const triggerUpdateEnvironmentDetail = (payload: IEnvironment) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.environmentDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch, currentEntity }) => dispatch(
            triggerFlashMessage({
                type: 'success',
                translationKey: 'flash_messages.environment.update',
                translationPlaceholders: {
                    name: (currentEntity as IEnvironment).name,
                },
            }),
        ),
        onFail: ({ dispatch }) => dispatch(
            triggerFlashMessage({
                type: 'error',
                translationKey: 'flash_messages.common.responseError',
            }),
        ),
        notificationsToTrigger: [StateChangeNotification.ENVIRONMENT_DETAIL],
    });

export const triggerCreateEnvironmentDetail = (payload: IEnvironment) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.environmentDetail,
        },
        onSuccess: ({ dispatch, currentEntity }) => dispatch(
            triggerFlashMessage({
                type: 'success',
                translationKey: 'flash_messages.environment.create',
                translationPlaceholders: {
                    name: (currentEntity as IEnvironment).name,
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
        notificationsToTrigger: [StateChangeNotification.ENVIRONMENT_DETAIL],
    });
