import API_URLS from 'api/apiUrls';
import { post, put } from 'api/requestWrapper';
import { IConnectionEntity } from 'models/state/connections.model';

export function createConnection(connection: IConnectionEntity) {
    return post<IConnectionEntity>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTIONS,
        body: connection,
        contentType: 'application/json',
    });
}

export function updateConnection(connection: IConnectionEntity) {
    return put<IConnectionEntity>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.CONNECTIONS,
        body: [connection],
        contentType: 'application/json',
    });
}
