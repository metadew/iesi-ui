import { ITraceableApiErrorBase } from '@snipsonian/core/es/typings/apiErrors';
import {
    TEntityKey,
    AsyncOperation,
    IWithKeyIndex,
    IAsyncEntityApiConfig,
    IAsyncEntityKeyConfig,
    IAsyncEntityKeyConfigs,
    IAsyncEntityKeyOperationConfig,
    IAsyncEntitiesConfigManager,
    IEntitiesInitialState,
} from './types';
import { createAsyncEntityInitialState } from './createAsyncEntityInitialState';

export default function initAsyncEntitiesConfigManager
<State, CustomConfig = {}, Error = ITraceableApiErrorBase<{}>,
    ActionType = string, ExtraProcessInput = {}>(): IAsyncEntitiesConfigManager<State, CustomConfig, Error> {
    const asyncEntityConfigs: IAsyncEntityKeyConfigs<State, CustomConfig, Error> = {};
    let entitiesInititialState: IEntitiesInitialState = null;

    const configManager: IAsyncEntitiesConfigManager<State, CustomConfig, Error> = {
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

            asyncEntityConfigs[asyncEntityKey] = {
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
            return asyncEntityConfigs[asyncEntityKey];
        },

        getAsyncEntityOperationConfig({
            asyncEntityKey,
            operation,
        }: {
            asyncEntityKey: TEntityKey;
            operation: AsyncOperation;
        }): IAsyncEntityApiConfig<State, {}, {}, {}> {
            const config = configManager.getAsyncEntityConfig({ asyncEntityKey });
            if (!config) {
                return null;
            }
            return config[operation] as IAsyncEntityApiConfig<State, {}, {}, {}>;
        },

        getEntitiesInititialState(): IEntitiesInitialState {
            if (!entitiesInititialState) {
                entitiesInititialState = Object.keys(asyncEntityConfigs)
                    .reduce(
                        (accumulator, asyncEntityKey) => {
                            const asyncEntityKeyConfig = asyncEntityConfigs[asyncEntityKey];
                            (accumulator as IWithKeyIndex)[asyncEntityKey] = asyncEntityKeyConfig.initialState;
                            return accumulator;
                        },
                        {} as IEntitiesInitialState,
                    );
            }

            return entitiesInititialState;
        },
    };

    return configManager;
}

const validOperations: string[] = Object.values(AsyncOperation);

function isValidOperation(possibleOperation: string): boolean {
    return validOperations.indexOf(possibleOperation) !== -1;
}
