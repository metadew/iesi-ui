import API_URLS from 'api/apiUrls';
import { post, put } from 'api/requestWrapper';
import { IComponentEntity } from 'models/state/components.model';

export function createComponent(component: IComponentEntity) {
    return post<IComponentEntity>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.COMPONENTS,
        body: component,
        contentType: 'application/json',
    });
}

export function updateComponent(component: IComponentEntity) {
    return put<IComponentEntity>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.COMPONENTS,
        body: [component],
        contentType: 'application/json',
    });
}
