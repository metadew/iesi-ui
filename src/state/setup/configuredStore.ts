import { createActionableObservableStateStore } from '@snipsonian/observable-state/es';
import produce from 'immer';
import { IExtraProcessInput, IState, StateChangeNotification } from '../../models/state.models';
import { STATE_STORAGE_KEY } from '../../config/state.config';
import { isStateLoggingEnabled, isStateStorageEnabled } from '../../config/develop.config';
import { api } from '../../api';
import { getAsyncEntityInitialState }
    from '../../snipsonian/observable-state/src/actionableStore/entities/getAsyncEntityInitialState';
import { AsyncOperation } from '../../snipsonian/observable-state/src/actionableStore/entities/types';

// const configuredStore = createObservableStateStore<IState, StateChangeNotification>({
const configuredStore = createActionableObservableStateStore<IState, IExtraProcessInput, StateChangeNotification>({
    initialState: {
        envConfig: getAsyncEntityInitialState({ operations: [AsyncOperation.fetch] }),
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
    },
});

export default configuredStore;
