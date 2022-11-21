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

interface ISecurityGroupsResponse {
    _embedded: {
        securityGroups: ISecurityGroup[];
    };
    page: IPageData;
}

export function fetchSecurityGroups({ pagination, filter, sort }: IFetchSecurityGroupListPayload) {
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

export function createSecurityGroup(securityGroup: ISecurityGroupBase) {
    return post<ISecurityGroupBase>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.SECURITY_GROUPS,
        body: securityGroup,
        contentType: 'application/json',
    });
}

export function updateSecurityGroup(securityGroup: ISecurityGroup) {
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

export function deleteSecurityGroup({ id }: ISecurityGroupByIdPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.SECURITY_GROUPS_BY_ID,
        pathParams: {
            id,
        },
    });
}

export function assignTeam({ id, teamId }: ISecurityGroupAssignTeamPayload) {
    return post<ISecurityGroup, ISecurityGroup>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.SECURITY_GROUPS_BY_ID_AND_TEAM_ID,
        pathParams: {
            id,
            'team-uuid': teamId,
        },
        mapResponse: ({ data }) => data,
    });
}

export function unassignTeam({ id, teamId }: ISecurityGroupAssignTeamPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.SECURITY_GROUPS_BY_ID_AND_TEAM_ID,
        pathParams: {
            id,
            'team-uuid': teamId,
        },
    });
}
