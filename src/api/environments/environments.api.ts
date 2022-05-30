import { IPageData } from 'models/state/iesiGeneric.models';
import { IEnvironment, IEnvironmentEntity, IFetchEnvironmentsListPayload } from 'models/state/environments.models';
// eslint-disable-next-line import/no-cycle
import { get, post, put, remove } from 'api/requestWrapper';
import API_URLS from '../apiUrls';

interface IEnvironmentsResponse {
    _embedded: {
        environmentDtoList: IEnvironment[];
    };
    page: IPageData;
}

export function fetchEnvironments({ pagination, filter, sort }: IFetchEnvironmentsListPayload) {
    return get<IEnvironmentEntity, IEnvironmentsResponse>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.ENVIRONMENTS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            environments: data._embedded.environmentDtoList,
            page: data.page,
        }),
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
        mapResponse: ({ data }) => ({ ...data }),

    });
}

export function createEnvironment(environment: IEnvironment) {
    return post<IEnvironment>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.ENVIRONMENTS,
        body: environment,
        contentType: 'application/json',
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
        contentType: 'application/json',
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
