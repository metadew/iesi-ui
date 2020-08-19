import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import {
    ICreateExecutionRequestPayload,
    IExecutionRequestByIdPayload,
    IFetchExecutionRequestListPayload,
} from 'models/state/executionRequests.models';
import { StateChangeNotification } from 'models/state.models';
import { AsyncOperation } from 'snipsonian/observable-state/src/actionableStore/entities/types';

export const triggerFetchExecutionRequests = (payload: IFetchExecutionRequestListPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequests,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.EXECUTION_REQUESTS_LIST],
    });

export const triggerFetchExecutionRequestDetail = (payload: IExecutionRequestByIdPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequestDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.EXECUTION_REQUESTS_DETAIL],
    });

export const triggerCreateExecutionRequest = (payload: ICreateExecutionRequestPayload) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequestDetail,
            updateDataOnSuccess: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.EXECUTION_REQUESTS_CREATE],
    });

export const triggerResetAsyncExecutionRequest = ({
    resetDataOnTrigger,
    operation,
}: {
    resetDataOnTrigger?: boolean;
    operation: AsyncOperation;
}) =>
    entitiesStateManager.triggerAsyncEntityReset({
        asyncEntityToReset: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequestDetail,
            resetDataOnTrigger,
        },
        extraInputSelector: () => ({}),
        notificationsToTrigger: [StateChangeNotification.EXECUTION_REQUESTS_CREATE],
        operation,
    });
