import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import {
    IFetchSecurityGroupListPayload,
    ISecurityGroupByIdPayload,
    ISecurityGroupByNamePayload,
    ISecurityGroupPost,
} from 'models/state/securityGroups.model';
import { triggerFlashMessage } from 'state/ui/actions';

export const triggerFetchSecurityGroups = (filter: IFetchSecurityGroupListPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.securityGroups,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => filter,
        notificationsToTrigger: [
            StateChangeNotification.IAM_SECURITY_GROUPS_LIST,
        ],
        itself: triggerFetchSecurityGroups,
    });

export const triggerFetchSecurityGroupDetail = (payload: ISecurityGroupByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.securityGroupDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [
            StateChangeNotification.IAM_SECURITY_GROUPS_DETAIL,
        ],
        itself: triggerFetchSecurityGroupDetail,
    });

export const triggerCreateSecurityGroupDetail = (payload: ISecurityGroupPost) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.securityGroupDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.security_group.create',
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
                    translationKey: 'flash_messages.security_group.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_SECURITY_GROUPS_DETAIL],
        itself: triggerCreateSecurityGroupDetail,
    });

export const triggerDeleteSecurityGroupDetail = (payload: ISecurityGroupByIdPayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.securityGroupDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.security_group.delete',
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
                    translationKey: 'flash_messages.security_group.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_SECURITY_GROUPS_DETAIL],
        itself: triggerDeleteSecurityGroupDetail,
    });
