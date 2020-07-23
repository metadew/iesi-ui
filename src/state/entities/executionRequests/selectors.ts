import { IState } from 'models/state.models';

export const getAsyncExecutionRequests = (state: IState) => state.entities.executionRequests;
export const getAsyncExecutionRequestDetail = (state: IState) => state.entities.executionRequestDetail;
