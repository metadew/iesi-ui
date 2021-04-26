import API_URLS from 'api/apiUrls';
import { get, post, put, remove } from 'api/requestWrapper';
import {
    IComponent,
    IComponentByNameAndVersionPayload,
    IComponentEntity,
    IFetchComponentsListPayload,
} from 'models/state/components.model';
import { IPageData } from 'models/state/iesiGeneric.models';

interface IComponentsResponse {
    _embedded: {
        componentDtoList: IComponent[];
    };
    page: IPageData;
}

export function fetchComponents({ pagination, filter, sort }: IFetchComponentsListPayload) {
    return get<IComponentEntity, IComponentsResponse>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.COMPONENTS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            components: data._embedded.componentDtoList,
            page: data.page,
        }),
    });
}

export function createComponent(component: IComponent) {
    return post<IComponent>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.COMPONENTS,
        body: component,
        contentType: 'application/json',
    });
}

export function updateComponent(component: IComponent) {
    return put<IComponent>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.COMPONENTS,
        body: [component],
        contentType: 'application/json',
    });
}

export function deleteComponentVersion({ name, version }: IComponentByNameAndVersionPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.COMPONENT_BY_NAME_VERSION,
        pathParams: {
            name,
            version,
        },
    });
}
