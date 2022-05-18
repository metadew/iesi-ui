import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import { IFetchTeamsListPayload, ITeamByIdPayload, ITeamByNamePayload, ITeamPost } from 'models/state/team.model';
import { triggerFlashMessage } from 'state/ui/actions';
import { ISecurityGroupAssignTeamPayload } from 'models/state/securityGroups.model';

export const triggerFetchTeams = (filter: IFetchTeamsListPayload) => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.teams,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => filter,
    notificationsToTrigger: [StateChangeNotification.IAM_TEAMS_LIST],
});

export const triggerFetchTeamDetail = (payload: ITeamByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.teamDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.IAM_TEAMS_DETAIL],
    });

export const triggerCreateTeamDetail = (payload: ITeamPost) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.teamDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.team.create',
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
                    translationKey: 'flash_messages.team.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_TEAMS_DETAIL],
    });

export const triggerDeleteTeamDetail = (payload: ITeamByIdPayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.teamDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.team.delete',
                type: 'warning',
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
                    translationKey: 'flash_mesage.team.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_TEAMS_DETAIL],
    });

export const triggerAssignTeamToSecurityGroup = (payload: ISecurityGroupAssignTeamPayload) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.teamDetailSecurityGroup,
            updateDataOnSuccess: true,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.team.add_security_group',
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
                    translationKey: 'flash_messages.team.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_TEAM_DETAIL_SECURITY_GROUP],
    });

export const triggerUnassignTeamToSecurityGroup = (payload: ISecurityGroupAssignTeamPayload) =>
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.teamDetailSecurityGroup,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch }) => {
            dispatch(triggerFlashMessage({
                translationKey: 'flash_messages.team.remove_security_group',
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
                    translationKey: 'flash_messages.team.error',
                    type: 'error',
                }));
            }
        },
        notificationsToTrigger: [StateChangeNotification.IAM_TEAM_DETAIL_SECURITY_GROUP],
    });
