import API_URLS from 'api/apiUrls';
// eslint-disable-next-line import/no-cycle
import { get, post, put, remove } from 'api/requestWrapper';
import {
    IConnection,
    IConnectionByNamePayload,
    IConnectionEntity, IConnectionImportPayload,
    IFetchConnectionsListPayload,
} from 'models/state/connections.model';
import { IPageData } from 'models/state/iesiGeneric.models';
import FileSaver from 'file-saver';

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
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            connections: data._embedded.connectionDtoList,
            page: data.page,
        }),
    });
}

export function fetchConnection({ name }: IConnectionByNamePayload) {
    return get<IConnection>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.CONNECTION_BY_NAME,
        pathParams: {
            name,
        },
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data,
    });
}

export function fetchConnectionDownload({ name }: IConnectionByNamePayload) {
    return get<any>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTION_BY_NAME_DOWNLOAD,
        responseType: 'blob',
        pathParams: {
            name,
        },
    }).then((response) => {
        const blob = new Blob([response]);
        FileSaver.saveAs(blob, `connection_${name}.zip`);
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

export async function createConnectionImport({ value }: IConnectionImportPayload) {
    return post<string | FormData>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTION_IMPORT,
        body: value,
        contentType: value instanceof FormData ? 'multipart/form-data' : 'text/plain',
        headers: {
            'Content-Type': value instanceof FormData ? 'multipart/form-data' : 'text/plain',
        },
        mapResponse: ({ data }) => data,
    });
}

export function updateConnection(connection: IConnection) {
    return put<IConnection>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTION_BY_NAME,
        pathParams: {
            name: connection.name,
        },
        body: connection,
        contentType: 'application/json',
    });
}

export function deleteConnection({ name }: IConnectionByNamePayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTION_BY_NAME,
        pathParams: {
            name,
        },
    });
}
