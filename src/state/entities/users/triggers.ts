import { StateChangeNotification } from 'models/state.models';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { ITeamAssignUserRolePayload, ITeamDeleteUserRole } from 'models/state/team.model';
import { IFetchUsersListPayload, IUserByNamePayload, IUserPost, IUserPostPayload } from 'models/state/user.model';
import { triggerFlashMessage } from 'state/ui/actions';
import entitiesStateManager from '../entitiesStateManager';

export const triggerFetchUsers = (payload: IFetchUsersListPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.users,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.IAM_USERS_LIST],
    });

export const triggerFetchUserDetail = (payload: IUserByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.userDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.IAM_USERS_DETAIL],
    });

export const triggerCreateUserDetail = (payload: IUserPost) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.userDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.user.create',
                type: 'success',
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
            } else {
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.user.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_USERS_DETAIL],
    });

export const triggerUpdateUserDetail = (payload: IUserPostPayload) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.userDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.user.update',
                type: 'success',
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
            } else {
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.user.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_USERS_DETAIL],
    });

export const triggerAssignUserRole = (payload: ITeamAssignUserRolePayload) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.userDetailRole,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.user.add_role',
                type: 'success',
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
            } else {
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.user.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_USER_DETAIL_ROLE],
    });

export const triggerDeleteUserRole = (payload: ITeamDeleteUserRole) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.userDetailRole,
        },
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.user.delete_role',
                type: 'info',
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
            } else {
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.user.error',
                    type: 'error',
                }));
            }
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.IAM_USER_DETAIL_ROLE],
    });
