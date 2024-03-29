import API_URLS from 'api/apiUrls';
// eslint-disable-next-line import/no-cycle
import { get, post, put, remove } from 'api/requestWrapper';
import { IPageData } from 'models/state/iesiGeneric.models';
import {
    IFetchTeamsListPayload,
    ITeam,
    ITeamAssignUserRolePayload,
    ITeamBase,
    ITeamByIdPayload,
    ITeamByNamePayload,
    ITeamDeleteUserRole,
    ITeamEntity,
} from 'models/state/team.model';
import { getTeamsWithDistinctUsers, getTeamWithDistinctUsers } from 'utils/teams/teamUtils';

interface ITeamsResponse {
    _embedded: {
        teams: ITeam[];
    };
    page: IPageData;
}

export function fetchTeams({ pagination, filter, sort }: IFetchTeamsListPayload) {
    return get<ITeamEntity, ITeamsResponse>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.TEAMS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            teams: getTeamsWithDistinctUsers(data._embedded.teams),
            page: data.page,
        }),
    });
}

export function fetchTeam({ name }: ITeamByNamePayload) {
    return get<ITeamBase>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.TEAM_BY_NAME,
        pathParams: {
            name,
        },
        mapResponse: ({ data }) => getTeamWithDistinctUsers(data),
    });
}

export function createTeam(team: ITeamBase) {
    return post<ITeamBase>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEAMS,
        body: team,
        contentType: 'application/json',
    });
}

export function updateTeam(team: ITeam) {
    return put<ITeam>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEAM_BY_ID,
        body: team,
        pathParams: {
            id: team.id,
        },
        contentType: 'application/json',
    });
}

export function deleteTeam({ id }: ITeamByIdPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEAM_BY_ID,
        pathParams: {
            id,
        },
    });
}

export function assignRoleToUser({ id, roleId, userId }: ITeamAssignUserRolePayload) {
    return post<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEAM_BY_ID_AND_ROLE_ID,
        body: {
            id: userId,
        },
        pathParams: {
            id,
            roleId,
        },
    });
}

export function deleteRoleFromUser({ id, roleId, userId }: ITeamDeleteUserRole) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.TEAM_BY_ID_AND_ROLE_ID_AND_USER_ID,
        pathParams: {
            id,
            roleId,
            userId,
        },
    });
}
