import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import {
    ICreateExecutionRequestPayload,
    IExecutionRequestByIdPayload,
    IFetchExecutionRequestListPayload,
} from 'models/state/executionRequests.models';
import { StateChangeNotification } from 'models/state.models';
import { AsyncOperation } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { triggerFlashMessage } from 'state/ui/actions';

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
        onFail: ({ dispatch, error }) => {
            let message = 'Unknown error';
            if (error.status) {
                switch (error.status) {
                    case -1:
                        message = 'Cannot connect to the server';
                        break;
                    default:
                        message = error.response?.message;
                        break;
                }
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.common.responseError',
                    translationPlaceholders: {
                        message,
                    },
                    type: 'error',
                }));
            } else {
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.execution_request.error',
                    translationPlaceholders: {
                        message,
                    },
                    type: 'error',
                }));
            }
        },
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
