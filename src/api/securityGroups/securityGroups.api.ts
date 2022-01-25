import API_URLS from 'api/apiUrls';
import { get, post, put, remove } from 'api/requestWrapper';
import { IPageData } from 'models/state/iesiGeneric.models';
import {
    IFetchSecurityGroupsPayload,
    ISecurityGroup,
    ISecurityGroupBase,
    ISecurityGroupByIdPayload,
    ISecurityGroupByNamePayload,
    ISecurityGroupEntity,
} from 'models/state/securityGroups.model';

interface ISecurityGroupsResponse {
    _embedded: {
        securityGroups: ISecurityGroup[];
    };
    page: IPageData;
}

export function fetchSecurityGroups({ pagination, filter, sort }: IFetchSecurityGroupsPayload) {
    return get<ISecurityGroupEntity, ISecurityGroupsResponse>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.SECURITY_GROUPS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            securityGroups: data._embedded.securityGroups,
            page: data.page,
        }),
    });
}

export function fetchSecurityGroup({ name }: ISecurityGroupByNamePayload) {
    return get<ISecurityGroupBase>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.SECURITY_GROUPS_BY_NAME,
        pathParams: {
            name,
        },
        mapResponse: ({ data }) => data,
    });
}

export function createDataset(securityGroup: ISecurityGroupBase) {
    return post<ISecurityGroupBase>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.SECURITY_GROUPS,
        body: securityGroup,
        contentType: 'application/json',
    });
}

export function updateDataset(securityGroup: ISecurityGroup) {
    return put<ISecurityGroup>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.SECURITY_GROUPS_BY_ID,
        body: securityGroup,
        pathParams: {
            uuid: securityGroup.id,
        },
        contentType: 'application/json',
    });
}

export function deleteDataset({ id }: ISecurityGroupByIdPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.SECURITY_GROUPS_BY_ID,
        pathParams: {
            id,
        },
    });
}
