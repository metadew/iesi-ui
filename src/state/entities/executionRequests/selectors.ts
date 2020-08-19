import { IState } from 'models/state.models';
import { IExecutionRequest } from 'models/state/executionRequests.models';

export const getAsyncExecutionRequestsEntity = (state: IState) => state.entities.executionRequests;

export const getAsyncExecutionRequests = (state: IState) => {
    const entity = getAsyncExecutionRequestsEntity(state);
    return entity && entity.data ? entity.data.executionRequests : [] as IExecutionRequest[];
};

export const getAsyncExecutionRequestsPageData = (state: IState) => {
    const entity = getAsyncExecutionRequestsEntity(state);
    return entity && entity.data ? entity.data.page : null;
};

export const getAsyncExecutionRequestDetail = (state: IState) => state.entities.executionRequestDetail;
