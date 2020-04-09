import { initActionableReactObservableState } from '@snipsonian/react-observable-state/es';
import { IActionableStoreForComp } from '@snipsonian/react-observable-state/es/init/types';
import { IState, StateChangeNotification } from 'models/state.models';
import { ReactNode } from 'react';

const {
    ObservableStateProvider,
    observe: observeOrig,
    observeXL: observeXLOrig,
} = initActionableReactObservableState<IState, StateChangeNotification>();

export const StoreProvider = ObservableStateProvider;

export const observe = observeOrig;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IObserveProps extends IActionableStoreForComp<IState, StateChangeNotification> {}

export const observeXL = observeXLOrig;

export interface IPublicPropsWithChildren {
    children: ReactNode;
}
