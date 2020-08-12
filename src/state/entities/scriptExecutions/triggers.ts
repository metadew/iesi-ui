import { IScriptExecutionByRunIdAndProcessIdPayload } from 'models/state/scriptExecutions.models';
import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';

export const triggerFetchScriptExecutionDetail = (payload: IScriptExecutionByRunIdAndProcessIdPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.scriptExecutionDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.SCRIPT_EXECUTION_DETAIL],
    });
