import { IEnvironment } from 'models/state/environments.models';
import { IListResponse } from 'models/state/iesiGeneric.models';
import { get, post, put, remove } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchEnvironments() {
    return get<IEnvironment[], IListResponse<IEnvironment>>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.ENVIRONMENTS,
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
    });
}

export function fetchEnvironment({ name }: { name: string }) {
    return get<IEnvironment>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.ENVIRONMENT_BY_NAME,
        pathParams: {
            name,
        },
    });
}

export function createEnvironment(environment: IEnvironment) {
    return post<IEnvironment>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.ENVIRONMENTS,
        body: environment,
    });
}

export function updateEnvironment(environment: IEnvironment) {
    return put<IEnvironment>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.ENVIRONMENT_BY_NAME,
        pathParams: {
            name: environment.name,
        },
        body: environment,
    });
}

export function deleteEnvironment({ name }: IEnvironment) {
    return remove<{}>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.ENVIRONMENT_BY_NAME,
        pathParams: {
            name,
        },
    });
}
