import { IActionType, IConnectionType, IConstantParameter } from 'models/state/constants.models';
import { IListResponse } from 'models/state/iesiGeneric.models';
import { get } from '../requestWrapper';
import API_URLS from '../apiUrls';

interface IActionTypeResponse {
    name: string;
    description: string;
    status: string;
    parameters: IConstantParameter[];
}

export function fetchActionTypes() {
    return get<IActionType[], IActionTypeResponse[]>({
        isIesiApi: true,
        needsAuthentication: false,
        url: API_URLS.ACTION_TYPES,
        // eslint-disable-next-line arrow-body-style
        mapResponse: ({ data }) => {
            return data.map((action) => ({
                category: action.name.split('.')[0],
                type: action.name,
                name: action.description,
                parameters: action.parameters,
                status: action.status,
            }));
        },
    });
}

export function fetchConnectionTypes() {
    return get<IConnectionType[], IListResponse<IConnectionType>>({
        isIesiApi: true,
        needsAuthentication: false,
        url: API_URLS.CONNECTION_TYPES,
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
    });
}
