import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import {
    IEnvironment,
    IEnvironmentByNamePayload,
    IFetchEnvironmentsListPayload,
} from 'models/state/environments.models';
import { triggerFlashMessage } from 'state/ui/actions';

export const triggerFetchEnvironments = (payload: IFetchEnvironmentsListPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.environments,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.ENVIRONMENTS],
        itself: triggerFetchEnvironments,
    });

export const triggerFetchEnvironment = (payload: IEnvironmentByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.environmentDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.ENVIRONMENT_DETAIL],
        itself: triggerFetchEnvironment,
    });

export const triggerDeleteEnvironmentDetail = (payload: IEnvironmentByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.environmentDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.ENVIRONMENT_DETAIL],
        itself: triggerDeleteEnvironmentDetail,
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
                translationKey: 'flash_messages.environment.edit',
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
        itself: triggerUpdateEnvironmentDetail,
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
        itself: triggerCreateEnvironmentDetail,
    });
