import API_URLS from 'api/apiUrls';
// eslint-disable-next-line import/no-cycle
import { get, post, put, remove } from 'api/requestWrapper';
import { IPageData } from 'models/state/iesiGeneric.models';
import {
    IFetchTemplatesListPayload,
    ITemplate,
    ITemplateBase,
    ITemplateByNameAndVersionPayload,
    ITemplateEntity,
} from 'models/state/templates.model';

interface ITemplatesResponse {
    _embedded: {
        templates: ITemplate[];
    };
    page: IPageData;
}

export function fetchTemplates({ pagination, filter, sort }: IFetchTemplatesListPayload) {
    return get<ITemplateEntity, ITemplatesResponse>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.TEMPLATES,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            templates: data._embedded.templates,
            page: data.page,
        }),
    });
}

export function fetchTemplate({ name, version }: ITemplateByNameAndVersionPayload) {
    return get<ITemplateBase>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.TEMPLATE_BY_NAME_AND_VERSION,
        pathParams: {
            name,
            version,
        },
        mapResponse: ({ data }) => data,
    });
}

export function createTemplate(template: ITemplateBase) {
    return post<ITemplateBase>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEMPLATES,
        body: template,
        contentType: 'application/json',
    });
}

export function updateTemplate(template: ITemplate) {
    return put<ITemplate>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEMPLATE_BY_NAME_AND_VERSION,
        body: template,
        pathParams: {
            name: template.name,
            version: template.version,
        },
        contentType: 'application/json',
    });
}

export function deleteTemplate({ name, version }: ITemplateByNameAndVersionPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEMPLATE_BY_NAME_AND_VERSION,
        pathParams: {
            name,
            version,
        },
    });
}
