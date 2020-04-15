import isSet from '@snipsonian/core/es/is/isSet';
import { ITraceableApiErrorBase } from '@snipsonian/core/es/typings/apiErrors';
import { IGetState } from '@snipsonian/observable-state/es/store/types';
import { Action, Dispatch } from '@snipsonian/observable-state/es/actionableStore/types';
import { DEFAULT_PARENT_NOTIFICATIONS_DELIMITER }
    from '@snipsonian/observable-state/es/observer/extendNotificationsToTrigger';
import {
    TEntityKey,
    AsyncOperation,
    AsyncStatus,
    IAsyncEntity,
    IWithKeyIndex,
    IAsyncEntityApiConfig,
    IAsyncEntityKeyConfig,
    IAsyncEntityKeyConfigs,
    IAsyncEntityKeyOperationConfig,
    IAsyncEntityManager,
    IAsyncEntityToFetch,
    ITriggerAsyncEntityFetchProps, IEntitiesInitialState,
} from './types';
import { createAsyncEntityInitialState } from './createAsyncEntityInitialState';
import { IAsyncEntityActionCreators, initAsyncEntityActionCreators } from './asyncEntityActionCreators';

export default function initAsyncEntityManager
<State, CustomConfig = {}, Error = ITraceableApiErrorBase<{}>,
    ActionType = string, StateChangeNotificationKey = string, ExtraProcessInput = {}>({
    entitiesStateField = 'entities',
    getState,
    dispatch,
    notificationDelimiter = DEFAULT_PARENT_NOTIFICATIONS_DELIMITER,
}: {
    entitiesStateField: string;
    getState: IGetState<State>;
    dispatch: Dispatch<Action>;
    notificationDelimiter?: string;
}): IAsyncEntityManager<State, StateChangeNotificationKey, CustomConfig, Error> {
    const configs: IAsyncEntityKeyConfigs<State, CustomConfig, Error> = {};
    let entitiesInititialState: IEntitiesInitialState = null;
    // eslint-disable-next-line max-len
    let asyncEntityActionCreators: IAsyncEntityActionCreators<ActionType, State, ExtraProcessInput, StateChangeNotificationKey> = null;

    const manager: IAsyncEntityManager<State, StateChangeNotificationKey, CustomConfig, Error> = {
        register<Data, ApiInput, ApiResult, ApiResponse = ApiResult, ExtraInput extends object = {}>({
            asyncEntityKey,
            operationsConfig,
            initialData,
            customConfig,
        }: {
            asyncEntityKey: TEntityKey;
            operationsConfig: IAsyncEntityKeyOperationConfig<State, ApiInput, ApiResult, ApiResponse, ExtraInput>;
            initialData?: Data;
            customConfig?: CustomConfig;
        }): void {
            const operations = Object.keys(operationsConfig)
                .filter(isValidOperation) as AsyncOperation[];
            const initialState = createAsyncEntityInitialState<Data, Error>({ operations, data: initialData });

            configs[asyncEntityKey] = {
                operations,
                initialState,
                ...customConfig,
                ...operationsConfig,
            };
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getAsyncEntityConfig<Data = any>({
            asyncEntityKey,
        }: {
            asyncEntityKey: TEntityKey;
        }): IAsyncEntityKeyConfig<State, Data, {}, {}, {}, {}, Error> {
            return configs[asyncEntityKey];
        },

        getAsyncEntityOperationConfig({
            asyncEntityKey,
            operation,
        }: {
            asyncEntityKey: TEntityKey;
            operation: AsyncOperation;
        }): IAsyncEntityApiConfig<State, {}, {}, {}> {
            const config = manager.getAsyncEntityConfig({ asyncEntityKey });
            if (!config) {
                return null;
            }
            return config[operation] as IAsyncEntityApiConfig<State, {}, {}, {}>;
        },

        triggerAsyncEntityFetch<ExtraInput extends object, ApiInput = {}, ApiResult = {}, ApiResponse = ApiResult>({
            asyncEntityToFetch,
            extraInput,
            notificationsToTrigger,
            nrOfParentNotificationLevelsToTrigger,
        }: ITriggerAsyncEntityFetchProps<State, ExtraInput, StateChangeNotificationKey>): boolean {
            const { asyncEntityKey, resetDataOnTrigger } = asyncEntityToFetch;
            const operation = AsyncOperation.fetch;
            const operationConfig = (manager.getAsyncEntityOperationConfig({
                asyncEntityKey,
                operation,
            })) as unknown as IAsyncEntityApiConfig<State, ExtraInput, ApiInput, ApiResult, ApiResponse>;
            if (!operationConfig) {
                return false;
            }

            if (!shouldEntityBeFetched({ asyncEntityToFetch, state: getState(), extraInput })) {
                return false;
            }

            // eslint-disable-next-line max-len
            dispatch(getAsyncEntityActionCreators().fetchAsyncEntityAction<ExtraInput, ApiInput, ApiResult, ApiResponse>({
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
            return (getState() as IWithKeyIndex)[entitiesStateField][asyncEntityKey];
        },

        getEntitiesInititialState(): IEntitiesInitialState {
            if (!entitiesInititialState) {
                entitiesInititialState = Object.keys(configs)
                    .reduce(
                        (accumulator, asyncEntityKey) => {
                            const asyncEntityKeyConfig = configs[asyncEntityKey];
                            (accumulator as IWithKeyIndex)[asyncEntityKey] = asyncEntityKeyConfig.initialState;
                            return accumulator;
                        },
                        {} as IEntitiesInitialState,
                    );
            }

            return entitiesInititialState;
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

        const currentAsyncEntityFetchOperation = manager.getAsyncEntity({ asyncEntityKey }).fetch;

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
                entitiesInitialState: manager.getEntitiesInititialState(),
            });
        }

        return asyncEntityActionCreators;
    }

    return manager;
}

const validOperations: string[] = Object.values(AsyncOperation);

function isValidOperation(possibleOperation: string): boolean {
    return validOperations.indexOf(possibleOperation) !== -1;
}
