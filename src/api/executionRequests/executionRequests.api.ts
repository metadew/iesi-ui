import {
    IExecutionRequest,
    IExecutionRequestByIdPayload,
    ICreateExecutionRequestPayload,
    IFetchExecutionRequestListPayload,
    IExecutionRequestsEntity,
} from 'models/state/executionRequests.models';
import { IPageData } from 'models/state/iesiGeneric.models';
import { get, post } from '../requestWrapper';
import API_URLS from '../apiUrls';

interface IExecutionRequestsResponse {
    _embedded: {
        // eslint-disable-next-line camelcase
        execution_requests: IExecutionRequest[];
    };
    page: IPageData;
}

export function fetchExecutionRequests({ pagination, filter, sort }: IFetchExecutionRequestListPayload) {
    return get<IExecutionRequestsEntity, IExecutionRequestsResponse>({
        url: API_URLS.EXECUTION_REQUESTS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            executionRequests: data._embedded.execution_requests,
            page: data.page,
        }),
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

export function createExecutionRequest(executionRequest: ICreateExecutionRequestPayload) {
    return post<IExecutionRequest>({
        url: API_URLS.EXECUTION_REQUESTS,
        body: executionRequest,
    });
}
