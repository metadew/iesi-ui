import produce from 'immer';
import isSet from '@snipsonian/core/es/is/isSet';
import { IState } from '../../models/state.models';
import { getStore } from '../../state';
import getMockState from './getMockState';

export default function setMockState({
    startingState = getMockState({}),
    set,
}: {
    startingState?: IState;
    set?: (mockState: IState) => void;
}) {
    const newState = isSet(set)
        ? produce(startingState, set)
        : startingState;

    getStore().setState({
        newState,
    });
}
