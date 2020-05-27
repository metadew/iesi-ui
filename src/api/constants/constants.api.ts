import { IActionType, IConnectionType } from 'models/state/constants.models';
import { IListResponse } from 'models/state/iesiGeneric.models';
import { get } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchActionTypes() {
    return get<IActionType[], IListResponse<IActionType>>({
        url: API_URLS.ACTION_TYPES,
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
    });
}

export function fetchConnectionTypes() {
    return get<IConnectionType[], IListResponse<IConnectionType>>({
        url: API_URLS.CONNECTION_TYPES,
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
    });
}
