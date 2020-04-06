import { getRegisteredStore } from '@snipsonian/observable-state/es/store/storeManager';
import { IActionableObservableStateStore } from '@snipsonian/observable-state/es/actionableStore/types';
import { createObservableStateAction } from '@snipsonian/observable-state/es/actionableStore/actionCreators';
import { IState, IExtraProcessInput, StateChangeNotification, IAction } from '../models/state.models';

/** Without circular dependencies */
export function getStore() {
    // eslint-disable-next-line max-len
    return getRegisteredStore<IState, StateChangeNotification>() as IActionableObservableStateStore<IState, StateChangeNotification>;
}

export function createAction<Payload extends object>(
    action: IAction<Payload>,
) {
    return createObservableStateAction<string, Payload, IState, IExtraProcessInput, StateChangeNotification>(action);
}
