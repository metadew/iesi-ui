import { initActionableReactObservableState } from '@snipsonian/react-observable-state/es';
import { IState, StateChangeNotification } from '../models/state.models';

const { ObservableStateProvider, observe } = initActionableReactObservableState<IState, StateChangeNotification>();

export const StoreProvider = ObservableStateProvider;

export default observe;
