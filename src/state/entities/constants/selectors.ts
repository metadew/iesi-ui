import { IState } from 'models/state.models';

export const getAsyncActionTypes = (state: IState) => state.entities.actionTypes;
