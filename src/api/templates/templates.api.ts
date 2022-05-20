import API_URLS from 'api/apiUrls';
// eslint-disable-next-line import/no-cycle
import { get, post, put, remove } from 'api/requestWrapper';
import { IPageData } from 'models/state/iesiGeneric.models';
import {
    IFetchSecurityGroupListPayload,
    ISecurityGroup,
    ISecurityGroupAssignTeamPayload,
    ISecurityGroupBase,
    ISecurityGroupByIdPayload,
    ISecurityGroupByNamePayload,
    ISecurityGroupEntity,
} from 'models/state/securityGroups.model';
import {
    IFetchTemplatesListPayload,
    ITemplate, ITemplateBase, ITemplateByIdPayload,
    ITemplateByNamePayload,
    ITemplateEntity
} from "models/state/templates.models";

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

export function fetchTemplate({ name }: ITemplateByNamePayload) {
    return get<ITemplateBase>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.TEMPLATE_BY_NAME,
        pathParams: {
            name,
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
        url: API_URLS.TEMPLATE_BY_ID,
        body: template,
        pathParams: {
            uuid: template.id,
        },
        contentType: 'application/json',
    });
}

export function deleteTemplate({ id }: ITemplateByIdPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEMPLATE_BY_ID,
        pathParams: {
            id,
        },
    });
}