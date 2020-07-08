import { IState } from 'models/state.models';

export const getAsyncExecutionRequests = (state: IState) => state.entities.executionRequests;
