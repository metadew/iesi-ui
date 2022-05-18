import { AsyncOperation } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import {
    createAsyncEntityInitialState,
} from 'snipsonian/observable-state/src/actionableStore/entities/createAsyncEntityInitialState';
import { IStateStorageConfig } from '@snipsonian/observable-state/es/store/stateStorage';
import { IState } from 'models/state.models';
import { DEFAULT_LOCALE } from 'config/i18n.config';
import { STATE_STORAGE_KEY } from 'config/state.config';
import entitiesConfigManager from 'state/entities/entitiesConfigManager';
import { IEntitiesState } from 'models/state/entities.models';

export const initialState: IState = {
    envConfig: createAsyncEntityInitialState({ operations: [AsyncOperation.fetch] }),
    i18n: {
        locale: DEFAULT_LOCALE,
        areTranslationsRefreshed: false,
        showTranslationKeys: false,
    },
    ui: {
        flashMessages: [],
        pollingExecutionRequestIds: [],
        listFilters: {
            scripts: {
                filters: null,
                onlyShowLatestVersion: true,
                page: 1,
                sortedColumn: null,
            },
            executions: {
                filters: null,
                page: 1,
                sortedColumn: null,
            },
            components: {
                filters: null,
                onlyShowLatestVersion: true,
                page: 1,
                sortedColumn: null,
            },
            connections: {
                filters: null,
                page: 1,
                sortedColumn: null,
            },
            environments: {
                filters: null,
                page: 1,
                sortedColumn: null,
            },
            datasets: {
                filters: null,
                page: 1,
                sortedColumn: null,
            },
            users: {
                filters: null,
                page: 1,
                sortedColumn: null,
            },
            teams: {
                filters: null,
                page: 1,
                sortedColumn: null,
            },
            securityGroups: {
                filters: null,
                page: 1,
                sortedColumn: null,
            },
        },
    },
    auth: {
        // Dummy auth
        username: 'dummy-test-user',
        accessToken: '',
        refreshToken: '',
        expiresAt: new Date(),
        permissions: [],
    },
    entities: entitiesConfigManager.getEntitiesInititialState() as unknown as IEntitiesState,
};

export const stateStorageConfig: IStateStorageConfig<IState> = {
    session: {
        browserStorageKey: STATE_STORAGE_KEY,
        getStatePartToSave: (state) => ({
            envConfig: state.envConfig,
        }),
    },
};
