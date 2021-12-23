import { StateChangeNotification } from 'models/state.models';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { IFetchUsersListPayload, IUserBase, IUserByNamePayload } from 'models/state/user.model';
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

export const triggerCreateUserDetail = (payload: IUserBase) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.userDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.IAM_USERS_DETAIL],
    });
