import isSet from '@snipsonian/core/es/is/isSet';
import { ITraceableApiErrorBase } from '@snipsonian/core/es/typings/apiErrors';
import {
    IActionableObservableStateStore,
} from '@snipsonian/observable-state/es/actionableStore/types';
import { DEFAULT_PARENT_NOTIFICATIONS_DELIMITER }
    from '@snipsonian/observable-state/es/observer/extendNotificationsToTrigger';
import {
    TEntityKey,
    AsyncOperation,
    AsyncStatus,
    IAsyncEntity,
    IWithKeyIndex,
    IAsyncEntityApiConfig,
    IAsyncEntitiesConfigManager,
    IAsyncEntitiesStateManager,
    IAsyncEntityToFetch,
    ITriggerAsyncEntityFetchProps,
} from './types';
import { IAsyncEntityActionCreators, initAsyncEntityActionCreators } from './asyncEntityActionCreators';

export default function initAsyncEntitiesStateManager
<State, CustomConfig = {}, Error = ITraceableApiErrorBase<{}>,
    ActionType = string, StateChangeNotificationKey = string, ExtraProcessInput = {}>({
    asyncEntitiesConfigManager,
    entitiesStateField = 'entities',
    store,
    notificationDelimiter = DEFAULT_PARENT_NOTIFICATIONS_DELIMITER,
}: {
    asyncEntitiesConfigManager: IAsyncEntitiesConfigManager<State, CustomConfig, Error>;
    entitiesStateField?: string;
    store: IActionableObservableStateStore<State, StateChangeNotificationKey>;
    notificationDelimiter?: string;
}): IAsyncEntitiesStateManager<State, StateChangeNotificationKey, CustomConfig, Error> {
    // eslint-disable-next-line max-len
    let asyncEntityActionCreators: IAsyncEntityActionCreators<ActionType, State, ExtraProcessInput, StateChangeNotificationKey> = null;

    const stateManager: IAsyncEntitiesStateManager<State, StateChangeNotificationKey, CustomConfig, Error> = {
        triggerAsyncEntityFetch<ExtraInput extends object, ApiInput = {}, ApiResult = {}, ApiResponse = ApiResult>({
            asyncEntityToFetch,
            extraInputSelector,
            notificationsToTrigger,
            nrOfParentNotificationLevelsToTrigger,
        }: ITriggerAsyncEntityFetchProps<State, ExtraInput, StateChangeNotificationKey>): boolean {
            const { asyncEntityKey, resetDataOnTrigger } = asyncEntityToFetch;
            const operation = AsyncOperation.fetch;
            const operationConfig = (asyncEntitiesConfigManager.getAsyncEntityOperationConfig({
                asyncEntityKey,
                operation,
            })) as unknown as IAsyncEntityApiConfig<State, ExtraInput, ApiInput, ApiResult, ApiResponse>;
            if (!operationConfig) {
                return false;
            }

            const extraInput = extraInputSelector({ state: store.getState() });

            if (!shouldEntityBeFetched({ asyncEntityToFetch, state: store.getState(), extraInput })) {
                return false;
            }

            // eslint-disable-next-line max-len
            store.dispatch(getAsyncEntityActionCreators().fetchAsyncEntityAction<ExtraInput, ApiInput, ApiResult, ApiResponse>({
                asyncEntityKey,
                extraInput,
                api: operationConfig.api,
                apiInputSelector: operationConfig.apiInputSelector,
                mapApiResponse: operationConfig.mapApiResponse,
                notificationsToTrigger: notificationsToTrigger
                    || getDefaultNotificationsToTrigger({ asyncEntityKey, operation }),
                nrOfParentNotificationLevelsToTrigger,
                resetDataOnTrigger,
            }));

            return true;
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getAsyncEntity<Data = any>({
            asyncEntityKey,
        }: {
            asyncEntityKey: TEntityKey;
        }): IAsyncEntity<Data, Error> {
            return (store.getState() as IWithKeyIndex)[entitiesStateField][asyncEntityKey];
        },
    };

    function shouldEntityBeFetched<ExtraInput extends object>({
        asyncEntityToFetch,
        state,
        extraInput,
    }: {
        asyncEntityToFetch: IAsyncEntityToFetch<State, ExtraInput>;
        state: State;
        extraInput: ExtraInput;
    }): boolean {
        const { asyncEntityKey, shouldFetch, refreshMode } = asyncEntityToFetch;

        if (shouldFetch && !shouldFetch({ state, extraInput })) {
            return false;
        }

        const currentAsyncEntityFetchOperation = stateManager.getAsyncEntity({ asyncEntityKey }).fetch;

        if (!currentAsyncEntityFetchOperation) {
            return false;
        }

        const isAlreadyFetched = currentAsyncEntityFetchOperation.status === AsyncStatus.Success;

        if (!isAlreadyFetched) {
            return true;
        }

        if (!isSet(refreshMode)) {
            return true;
        }

        if (refreshMode === 'always') {
            return true;
        }

        if (refreshMode === 'never') {
            return false;
        }

        return refreshMode({ state, extraInput });
    }

    function getDefaultNotificationsToTrigger({
        asyncEntityKey,
        operation,
    }: {
        asyncEntityKey: TEntityKey;
        operation: AsyncOperation;
    }): StateChangeNotificationKey[] {
        const notification = [
            entitiesStateField, asyncEntityKey, operation,
        ].join(notificationDelimiter) as unknown as StateChangeNotificationKey;
        return [notification];
    }

    function getAsyncEntityActionCreators() {
        if (!asyncEntityActionCreators) {
            // eslint-disable-next-line max-len
            asyncEntityActionCreators = initAsyncEntityActionCreators<State, ExtraProcessInput, ActionType, StateChangeNotificationKey>({
                entitiesStateField,
                entitiesInitialState: asyncEntitiesConfigManager.getEntitiesInititialState(),
            });
        }

        return asyncEntityActionCreators;
    }

    return stateManager;
}
