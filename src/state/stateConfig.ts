import { AsyncOperation } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { createAsyncEntityInitialState }
    from 'snipsonian/observable-state/src/actionableStore/entities/createAsyncEntityInitialState';
import { IStateStorageConfig } from '@snipsonian/observable-state/es/store/stateStorage';
import { IState } from 'models/state.models';
import { DEFAULT_LOCALE } from 'config/i18n.config';
import { STATE_STORAGE_KEY } from 'config/state.config';

export const initialState: IState = {
    envConfig: createAsyncEntityInitialState({ operations: [AsyncOperation.fetch] }),
    i18n: {
        locale: DEFAULT_LOCALE,
        areTranslationsRefreshed: false,
        showTranslationKeys: false,
    },
    ui: {
        flashMessages: [],
    },
    auth: {
        // Dummy auth
        username: 'dummy-test-user',
        permissions: {
            edit: true,
            execute: true,
        },
    },
};

export const stateStorageConfig: IStateStorageConfig<IState> = {
    session: {
        browserStorageKey: STATE_STORAGE_KEY,
        getStatePartToSave: (state) => ({
            envConfig: state.envConfig,
        }),
    },
};
