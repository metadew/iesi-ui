import isSet from '@snipsonian/core/es/is/isSet';
import { IObservableStateAction, Dispatch, Action } from '@snipsonian/observable-state/es/actionableStore/types';
import { createObservableStateAction } from '@snipsonian/observable-state/es/actionableStore/actionCreators';
import {
    TNrOfParentNotificationLevelsToTrigger,
} from '@snipsonian/observable-state/es/observer/extendNotificationsToTrigger';
import {
    AsyncOperation,
    IAsyncEntity,
    TEntityKey,
    IEntitiesInitialState,
    IWithKeyIndex,
} from './types';
import { asyncEntityFetch, asyncEntityCreate, asyncEntityRemove, asyncEntityUpdate } from './asyncEntityUpdaters';

export interface IAsyncEntityActionCreators<ActionType, State, ExtraProcessInput, StateChangeNotificationKey> {
    createAsyncEntityAction<ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>(
        // eslint-disable-next-line max-len
        props: ICreateUpdateAsyncEntityActionProps<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse>
        // eslint-disable-next-line max-len
    ): IObservableStateAction<ActionType, IAsyncEntityActionPayload, State, ExtraProcessInput, StateChangeNotificationKey>;

    updateAsyncEntityAction<ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>(
        // eslint-disable-next-line max-len
        props: ICreateUpdateAsyncEntityActionProps<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse>
        // eslint-disable-next-line max-len
    ): IObservableStateAction<ActionType, IAsyncEntityActionPayload, State, ExtraProcessInput, StateChangeNotificationKey>;

    removeAsyncEntityAction<ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>(
        // eslint-disable-next-line max-len
        props: ICreateRemoveAsyncEntityActionProps<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse>
        // eslint-disable-next-line max-len
    ): IObservableStateAction<ActionType, IAsyncEntityActionPayload, State, ExtraProcessInput, StateChangeNotificationKey>;

    fetchAsyncEntityAction<ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>(
        // eslint-disable-next-line max-len
        props: ICreateFetchAsyncEntityActionProps<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse>
        // eslint-disable-next-line max-len
    ): IObservableStateAction<ActionType, IAsyncEntityActionPayload, State, ExtraProcessInput, StateChangeNotificationKey>;
    resetAsyncEntityAction(
        props: ICReateResetAsyncEntityActionProps<State, StateChangeNotificationKey>
        // eslint-disable-next-line max-len
    ): IObservableStateAction<ActionType, IAsyncEntityActionPayload, State, ExtraProcessInput, StateChangeNotificationKey>;
}

interface ICreateAsyncEntityActionPropsBase
<State, StateChangeNotificationKey, ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult> {
    asyncEntityKey: TEntityKey;
    extraInput?: ExtraInput;
    api: (apiInput: ApiInput) => Promise<ApiResponse>;
    apiInputSelector?: (props: { state: State; extraInput?: ExtraInput }) => ApiInput;
    mapApiResponse?: (props: { response: ApiResponse; state: State }) => ApiResult;
    notificationsToTrigger: StateChangeNotificationKey[];
    nrOfParentNotificationLevelsToTrigger?: TNrOfParentNotificationLevelsToTrigger;
    dispatch: Dispatch<Action>;
    onSuccess: (props: { dispatch: Dispatch<Action> }) => void;
    onFail: (props: { dispatch: Dispatch<Action> }) => void;
}

interface ICreateFetchAsyncEntityActionProps
<State, StateChangeNotificationKey, ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>
    extends ICreateAsyncEntityActionPropsBase
    <State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse> {

    resetDataOnTrigger?: boolean; // default true
}

interface ICreateUpdateAsyncEntityActionProps
<State, StateChangeNotificationKey, ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>
    extends ICreateAsyncEntityActionPropsBase
    <State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse> {

    updateDataOnSuccess?: boolean; // default false
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICreateRemoveAsyncEntityActionProps
<State, StateChangeNotificationKey, ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>
    extends ICreateAsyncEntityActionPropsBase
    <State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse> {}

interface ICReateResetAsyncEntityActionProps<State, StateChangeNotificationKey> {
    operation: AsyncOperation;
    asyncEntityKey: TEntityKey;
    notificationsToTrigger: StateChangeNotificationKey[];
    nrOfParentNotificationLevelsToTrigger?: TNrOfParentNotificationLevelsToTrigger;
    resetDataOnTrigger: boolean;
}

interface IAsyncEntityActionPayload {
    operation: AsyncOperation;
}

// eslint-disable-next-line max-len
export function initAsyncEntityActionCreators<State, ExtraProcessInput, ActionType = string, StateChangeNotificationKey = string>({
    entitiesStateField = 'entities',
    entitiesInitialState,
}: {
    entitiesStateField?: string;
    entitiesInitialState: IEntitiesInitialState;
}): IAsyncEntityActionCreators<ActionType, State, ExtraProcessInput, StateChangeNotificationKey> {
    return {
        createAsyncEntityAction: <ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>({
            asyncEntityKey,
            extraInput = ({} as ExtraInput),
            api,
            apiInputSelector,
            mapApiResponse,
            notificationsToTrigger,
            nrOfParentNotificationLevelsToTrigger,
            updateDataOnSuccess = false,
            dispatch,
            onFail,
            onSuccess,
            // eslint-disable-next-line max-len
        }: ICreateUpdateAsyncEntityActionProps<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse>) =>
            createAsyncEntityActionBase({
                asyncEntityKey,
                extraInput,
                api,
                apiInputSelector,
                mapApiResponse,
                notificationsToTrigger,
                nrOfParentNotificationLevelsToTrigger,
                operation: AsyncOperation.create,
                resetDataOnTrigger: false,
                updateDataOnSuccess,
                dispatch,
                onFail,
                onSuccess,
            }),

        updateAsyncEntityAction: <ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>({
            asyncEntityKey,
            extraInput = ({} as ExtraInput),
            api,
            apiInputSelector,
            mapApiResponse,
            notificationsToTrigger,
            nrOfParentNotificationLevelsToTrigger,
            updateDataOnSuccess = false,
            dispatch,
            onFail,
            onSuccess,
            // eslint-disable-next-line max-len
        }: ICreateUpdateAsyncEntityActionProps<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse>) =>
            createAsyncEntityActionBase({
                asyncEntityKey,
                extraInput,
                api,
                apiInputSelector,
                mapApiResponse,
                notificationsToTrigger,
                nrOfParentNotificationLevelsToTrigger,
                operation: AsyncOperation.update,
                resetDataOnTrigger: false,
                updateDataOnSuccess,
                dispatch,
                onFail,
                onSuccess,
            }),

        removeAsyncEntityAction: <ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>({
            asyncEntityKey,
            extraInput = ({} as ExtraInput),
            api,
            apiInputSelector,
            notificationsToTrigger,
            nrOfParentNotificationLevelsToTrigger,
            dispatch,
            onFail,
            onSuccess,
            // eslint-disable-next-line max-len
        }: ICreateRemoveAsyncEntityActionProps<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse>) =>
            createAsyncEntityActionBase({
                asyncEntityKey,
                extraInput,
                api,
                apiInputSelector,
                mapApiResponse: () => entitiesInitialState[asyncEntityKey].data,
                notificationsToTrigger,
                nrOfParentNotificationLevelsToTrigger,
                operation: AsyncOperation.remove,
                resetDataOnTrigger: false,
                updateDataOnSuccess: true,
                dispatch,
                onFail,
                onSuccess,
            }),

        // TODO (but e.g. without always storing the response on success in the data)
        fetchAsyncEntityAction: <ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>({
            asyncEntityKey,
            extraInput = ({} as ExtraInput),
            api,
            apiInputSelector,
            mapApiResponse,
            notificationsToTrigger,
            nrOfParentNotificationLevelsToTrigger,
            resetDataOnTrigger = true,
            dispatch,
            onFail,
            onSuccess,
            // eslint-disable-next-line max-len
        }: ICreateFetchAsyncEntityActionProps<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse>) =>
            createAsyncEntityActionBase({
                asyncEntityKey,
                extraInput,
                api,
                apiInputSelector,
                mapApiResponse,
                notificationsToTrigger,
                nrOfParentNotificationLevelsToTrigger,
                operation: AsyncOperation.fetch,
                resetDataOnTrigger,
                updateDataOnSuccess: true,
                dispatch,
                onFail,
                onSuccess,
            }),

        resetAsyncEntityAction: ({
            asyncEntityKey,
            operation,
            notificationsToTrigger,
            nrOfParentNotificationLevelsToTrigger,
            resetDataOnTrigger = true,
        }: ICReateResetAsyncEntityActionProps<State, StateChangeNotificationKey>) =>
            createAsyncEntityResetActionBase({
                asyncEntityKey,
                notificationsToTrigger,
                nrOfParentNotificationLevelsToTrigger,
                operation,
                resetDataOnTrigger,
            }),
    };

    function createAsyncEntityResetActionBase({
        operation,
        resetDataOnTrigger,
        notificationsToTrigger,
        nrOfParentNotificationLevelsToTrigger,
        asyncEntityKey,
    }: {
        operation: AsyncOperation;
        asyncEntityKey: TEntityKey;
        notificationsToTrigger: StateChangeNotificationKey[];
        nrOfParentNotificationLevelsToTrigger?: TNrOfParentNotificationLevelsToTrigger;
        resetDataOnTrigger: boolean;
    }) {
        // eslint-disable-next-line max-len
        return createObservableStateAction<ActionType, IAsyncEntityActionPayload, State, ExtraProcessInput, StateChangeNotificationKey>({
            type: `${asyncEntityKey}_${operation.toUpperCase()}_reset` as unknown as ActionType,
            payload: {
                operation,
            },
            process: ({ setState }) => {
                // eslint-disable-next-line arrow-body-style
                updateAsyncEntityInState((entity) => {
                    return resetDataOnTrigger
                        ? getAsyncEntityUpdaterFromOperation(operation)
                            .reset(entity, entitiesInitialState[asyncEntityKey].data)
                        : getAsyncEntityUpdaterFromOperation(operation)
                            .resetWithoutDataReset(entity);
                });

                function updateAsyncEntityInState(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    entityUpdater: (currentEntity: IAsyncEntity<any>) => IAsyncEntity<any>,
                ) {
                    setState({
                        newState: (currentState: State) => {
                            const entity = (currentState as IWithKeyIndex)[entitiesStateField][asyncEntityKey];
                            return {
                                ...currentState,
                                [entitiesStateField]: {
                                    ...(currentState as IWithKeyIndex)[entitiesStateField],
                                    [asyncEntityKey]: entityUpdater(entity),
                                },
                            };
                        },
                        notificationsToTrigger,
                        nrOfParentNotificationLevelsToTrigger,
                    });
                }
            },
        });
    }

    function createAsyncEntityActionBase<ExtraInput extends object, ApiInput, ApiResult, ApiResponse = ApiResult>({
        asyncEntityKey,
        extraInput,
        api,
        apiInputSelector,
        mapApiResponse,
        notificationsToTrigger,
        nrOfParentNotificationLevelsToTrigger,
        operation,
        resetDataOnTrigger,
        updateDataOnSuccess,
        dispatch,
        onSuccess,
        onFail,
        // eslint-disable-next-line max-len
    }: ICreateAsyncEntityActionPropsBase<State, StateChangeNotificationKey, ExtraInput, ApiInput, ApiResult, ApiResponse> & {
        operation: AsyncOperation;
        resetDataOnTrigger: boolean;
        updateDataOnSuccess: boolean;
    }) {
        // eslint-disable-next-line max-len
        return createObservableStateAction<ActionType, IAsyncEntityActionPayload, State, ExtraProcessInput, StateChangeNotificationKey>({
            type: `${asyncEntityKey}_${operation.toUpperCase()}` as unknown as ActionType,
            payload: {
                operation,
                ...extraInput,
            },
            async process({ getState, setState }) {
                try {
                    // eslint-disable-next-line arrow-body-style
                    updateAsyncEntityInState((entity) => {
                        return resetDataOnTrigger
                            ? getAsyncEntityUpdaterFromOperation(operation)
                                .trigger(entity, entitiesInitialState[asyncEntityKey].data)
                            : getAsyncEntityUpdaterFromOperation(operation)
                                .triggerWithoutDataReset(entity);
                    });

                    const apiInput = isSet(apiInputSelector)
                        ? apiInputSelector({ state: getState(), extraInput })
                        : null;

                    const apiResponse = await api(apiInput);
                    const apiResult = isSet(mapApiResponse)
                        ? mapApiResponse({ response: apiResponse, state: getState() })
                        : apiResponse;

                    if (typeof onSuccess === 'function') {
                        onSuccess({ dispatch });
                    }

                    // eslint-disable-next-line arrow-body-style
                    updateAsyncEntityInState((entity) => {
                        return updateDataOnSuccess
                            ? getAsyncEntityUpdaterFromOperation(operation)
                                .succeeded(entity, apiResult)
                            : getAsyncEntityUpdaterFromOperation(operation)
                                .succeededWithoutDataSet(entity);
                    });
                } catch (error) {
                    if (typeof onFail === 'function') {
                        onFail({ dispatch });
                    }

                    updateAsyncEntityInState(
                        (entity) => getAsyncEntityUpdaterFromOperation(operation)
                            .failed(entity, error),
                    );
                }

                function updateAsyncEntityInState(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    entityUpdater: (currentEntity: IAsyncEntity<any>) => IAsyncEntity<any>,
                ) {
                    setState({
                        newState: (currentState) => {
                            const entity = (currentState as IWithKeyIndex)[entitiesStateField][asyncEntityKey];
                            return {
                                ...currentState,
                                [entitiesStateField]: {
                                    ...(currentState as IWithKeyIndex)[entitiesStateField],
                                    [asyncEntityKey]: entityUpdater(entity),
                                },
                            };
                        },
                        notificationsToTrigger,
                        nrOfParentNotificationLevelsToTrigger,
                    });
                }
            },
        });
    }
}

function getAsyncEntityUpdaterFromOperation(currentOperation: AsyncOperation) {
    const map = {
        [AsyncOperation.create]: asyncEntityCreate,
        [AsyncOperation.fetch]: asyncEntityFetch,
        [AsyncOperation.remove]: asyncEntityRemove,
        [AsyncOperation.update]: asyncEntityUpdate,
    };
    return map[currentOperation];
}
