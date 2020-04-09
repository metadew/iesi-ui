import { createActionableObservableStateStore } from '@snipsonian/observable-state/es';
import produce from 'immer';
import { getAsyncEntityInitialState }
    from 'snipsonian/observable-state/src/actionableStore/entities/getAsyncEntityInitialState';
import { AsyncOperation } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { IExtraProcessInput, ISetStateImmutableProps, IState, StateChangeNotification } from 'models/state.models';
import { STATE_STORAGE_KEY } from 'config/state.config';
import { isStateLoggingEnabled, isStateStorageEnabled } from 'config/develop.config';
import { DEFAULT_LOCALE } from 'config/i18n.config';
import { api } from 'api';

// const configuredStore = createObservableStateStore<IState, StateChangeNotification>({
const configuredStore = createActionableObservableStateStore<IState, IExtraProcessInput, StateChangeNotification>({
    initialState: {
        envConfig: getAsyncEntityInitialState({ operations: [AsyncOperation.fetch] }),
        i18n: {
            locale: DEFAULT_LOCALE,
            areTranslationsRefreshed: false,
            showTranslationKeys: false,
        },
    },
    storage: isStateStorageEnabled
        ? {
            session: {
                browserStorageKey: STATE_STORAGE_KEY,
                getStatePartToSave: (state) => ({
                    envConfig: state.envConfig,
                }),
            },
        }
        : null,
    middlewares: [],
    logStateUpdates: isStateLoggingEnabled,
    logNotifiedObserverNames: isStateLoggingEnabled,
    triggerParentNotifications: {
        nrOfLevels: 1,
        notificationDelimiter: '.',
    },
    observableStateActionExtraProcessInput: {
        api,
        produce,
        setStateImmutable: (props: ISetStateImmutableProps) => {
            const { toState, ...otherProps } = props;

            configuredStore.setState({
                newState: produce(configuredStore.getState(), toState),
                ...otherProps,
            });
        },
    },
});

export default configuredStore;
