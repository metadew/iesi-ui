import { initActionableReactObservableState } from '@snipsonian/react-observable-state/es';
import { IState, StateChangeNotification } from 'models/state.models';

const {
    ObservableStateProvider,
    observe: observeOrig,
    observeXL: observeXLOrig,
} = initActionableReactObservableState<IState, StateChangeNotification>();

export const StoreProvider = ObservableStateProvider;

export const observe = observeOrig;
export const observeXL = observeXLOrig;
