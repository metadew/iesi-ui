import {
    IExecutionRequest,
    IExecutionRequestByIdPayload,
    ICreateExecutionRequestPayload,
    IFetchExecutionRequestListPayload,
    IExecutionRequestsEntity,
} from 'models/state/executionRequests.models';
import { IListResponse } from 'models/state/iesiGeneric.models';
import { get, post } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchExecutionRequests({ pagination, filter, sort }: IFetchExecutionRequestListPayload) {
    const pageSize = pagination.size || 20;
    // TODO remove mock, correct ListResponse typing
    return get<IExecutionRequestsEntity, IListResponse<IExecutionRequest>>({
        url: API_URLS.EXECUTION_REQUESTS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            executionRequests: data._embedded.length <= pageSize ? data._embedded : data._embedded.slice(0, pageSize),
            page: {
                size: pageSize,
                // eslint-disable-next-line no-underscore-dangle
                totalElements: data._embedded.length,
                // eslint-disable-next-line no-underscore-dangle
                totalPages: Math.ceil(data._embedded.length / pageSize),
                number: pagination.page,
            },
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
