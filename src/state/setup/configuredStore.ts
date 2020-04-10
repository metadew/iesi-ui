import { createActionableObservableStateStore } from '@snipsonian/observable-state/es';
import produce from 'immer';
import { IExtraProcessInput, ISetStateImmutableProps, IState, StateChangeNotification } from 'models/state.models';
import { STATE_STORAGE_KEY } from 'config/state.config';
import { isStateLoggingEnabled, isStateStorageEnabled } from 'config/develop.config';
import { api } from 'api';
import initialState from '../initialState';

// const configuredStore = createObservableStateStore<IState, StateChangeNotification>({
const configuredStore = createActionableObservableStateStore<IState, IExtraProcessInput, StateChangeNotification>({
    initialState,
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
