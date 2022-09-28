import { StateChangeNotification } from 'models/state.models';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { ITeamAssignUserRolePayload, ITeamDeleteUserRole } from 'models/state/team.model';
import {
    IFetchUsersListPayload,
    IUserBase,
    IUserByNamePayload,
    IUserPasswordPostPayload,
    IUserPost,
} from 'models/state/user.model';
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
        itself: triggerFetchUsers,
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
        itself: triggerFetchUserDetail,
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
        itself: triggerCreateUserDetail,
    });

export const triggerUpdateUserDetail = (payload: IUserBase) =>
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
        itself: triggerCreateUserDetail,
    });

export const triggerUpdateUserDetailPassword = (payload: IUserPasswordPostPayload) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.userDetailPassword,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.user.update_password',
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
        notificationsToTrigger: [StateChangeNotification.IAM_USER_DETAIL_PASSWORD],
        itself: triggerUpdateUserDetailPassword,
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
        itself: triggerAssignUserRole,
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
        itself: triggerDeleteUserRole,
    });
