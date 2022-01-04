import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import { IFetchTeamsListPayload } from 'models/state/team.model';

export const triggerFetchTeams = (filter: IFetchTeamsListPayload) => entitiesStateManager.triggerAsyncEntityFetch<{}>({
    asyncEntityToFetch: {
        asyncEntityKey: ASYNC_ENTITY_KEYS.teams,
        refreshMode: 'always',
        resetDataOnTrigger: false,
    },
    extraInputSelector: () => filter,
    notificationsToTrigger: [StateChangeNotification.IAM_TEAMS_LIST],
});
