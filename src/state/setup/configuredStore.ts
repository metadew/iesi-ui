import { createActionableObservableStateStore } from '@snipsonian/observable-state/es';
import produce from 'immer';
import { IExtraProcessInput, ISetStateImmutableProps, IState, StateChangeNotification } from 'models/state.models';
import { isStateLoggingEnabled, isStateStorageEnabled } from 'config/develop.config';
import { api } from 'api';
import { initialState, stateStorageConfig } from '../stateConfig';

// const configuredStore = createObservableStateStore<IState, StateChangeNotification>({
const configuredStore = createActionableObservableStateStore<IState, IExtraProcessInput, StateChangeNotification>({
    initialState,
    storage: isStateStorageEnabled
        ? stateStorageConfig
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
