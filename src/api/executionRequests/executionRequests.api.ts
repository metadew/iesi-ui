import { IFetchExecutionRequestByIdPayload, IExecutionRequest } from 'models/state/executionRequests.models';
import { get } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchExecutionRequests() {
    return get<IExecutionRequest[]>({
        url: API_URLS.FETCH_EXECUTION_REQUESTS,
    });
}

export function fetchExecutionRequestById({
    id,
}: IFetchExecutionRequestByIdPayload) {
    return get<IExecutionRequest>({
        url: API_URLS.FETCH_EXECUTION_REQUEST_BY_ID,
        pathParams: {
            id,
        },
    });
}
