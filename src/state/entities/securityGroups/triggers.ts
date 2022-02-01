import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import {
    IFetchSecurityGroupListPayload,
    ISecurityGroupByNamePayload,
} from 'models/state/securityGroups.model';

export const triggerFetchSecurityGroups = (
    filter: IFetchSecurityGroupListPayload,
) =>
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
    });

export const triggerFetchSecurityGroupDetail = (
    payload: ISecurityGroupByNamePayload,
) =>
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
    });
