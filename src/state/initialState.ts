import { AsyncOperation } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { getAsyncEntityInitialState }
    from 'snipsonian/observable-state/src/actionableStore/entities/getAsyncEntityInitialState';
import { IState } from 'models/state.models';
import { DEFAULT_LOCALE } from 'config/i18n.config';

const initialState: IState = {
    envConfig: getAsyncEntityInitialState({ operations: [AsyncOperation.fetch] }),
    i18n: {
        locale: DEFAULT_LOCALE,
        areTranslationsRefreshed: false,
        showTranslationKeys: false,
    },
};

export default initialState;
