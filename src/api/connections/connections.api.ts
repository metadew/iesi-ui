import API_URLS from 'api/apiUrls';
import { get, post, put, remove } from 'api/requestWrapper';
import {
    IConnectionEntity,
    IConnection,
    IFetchConnectionsListPayload,
    IConnectionByNameAndEnvironmentPayload,
} from 'models/state/connections.model';
import { IPageData } from 'models/state/iesiGeneric.models';

interface IConnectionsResponse {
    _embedded: {
        connectionDtoList: IConnection[];
    };
    page: IPageData;
}

export function fetchConnections({ pagination, filter, sort }: IFetchConnectionsListPayload) {
    return get<IConnectionEntity, IConnectionsResponse>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.CONNECTIONS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => {
            console.log('DATA : ', data);
            return {
                // eslint-disable-next-line no-underscore-dangle
                connections: data._embedded.connectionDtoList,
                page: data.page,
            };
        },
    });
}

export function createConnection(connection: IConnection) {
    return post<IConnection>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTIONS,
        body: connection,
        contentType: 'application/json',
    });
}

export function updateConnection(connection: IConnection) {
    return put<IConnection>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTIONS,
        body: [connection],
        contentType: 'application/json',
    });
}

export function deleteComponentEnvironment({ name, environment }: IConnectionByNameAndEnvironmentPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTION_BY_NAME_ENVIRONMENT,
        pathParams: {
            name,
            environment,
        },
    });
}
