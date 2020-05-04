import { IExecutionRequest, IExecutionRequestByIdPayload } from 'models/state/executionRequests.models';
import { IListResponse } from 'models/state/iesiGeneric.models';
import { get } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchExecutionRequests() {
    return get<IExecutionRequest[], IListResponse<IExecutionRequest>>({
        url: API_URLS.EXECUTION_REQUESTS,
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
    });
}

export function fetchExecutionRequest({ id }: IExecutionRequestByIdPayload) {
    return get<IExecutionRequest>({
        url: API_URLS.EXECUTION_REQUEST_BY_ID,
        pathParams: {
            id,
        },
    });
}
