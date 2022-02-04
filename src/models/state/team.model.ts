import { IPageData, IPageFilter } from './iesiGeneric.models';

export interface IFetchTeamsListPayload {
    pagination?: IPageFilter;
    filter?: ITeamsListFilter;
    sort: string;
}

export interface ITeamsListFilter {
    name?: string;
}

export interface ITeamByNamePayload {
    name: string;
}

export interface ITeamByIdPayload {
    id: string;
}

export interface ITeamDeleteUserRole {
    id: string;
    roleId: string;
    userId: string;
}

export interface ITeamAssignUserRolePayload {
    id: string;
    roleId: string;
    userId: string;
}

export interface ITeamEntity {
    teams: ITeam[];
    page: IPageData;
}

export type ITeamNames = Array<string>;

export interface ITeam extends ITeamBase {
    users?: ITeamRoleUser[];
}
export interface ITeamBase {
    id?: string;
    teamName: string;
    securityGroups: ITeamSecurityGroup[];
    roles: ITeamRole[];
}

export interface ITeamSecurityGroup {
    id: string;
    name: string;
}

export interface ITeamRole {
    id: string;
    name: string;
    privileges: ITeamPrivilege[];
    users: ITeamRoleUser[];
}

export interface ITeamPrivilege {
    uuid: string;
    privilege: string;
}

export interface ITeamRoleUser {
    id: string;
    username: string;
    enabled: boolean;
    credentialsExpired: boolean;
    expired: boolean;
    locked: boolean;
}

export interface ITeamPost {
    teamName: string;
}

export interface ITeamColumnNames {
    name: string;
    securityGroups: number;
    users: number;
}

export interface ITeamUserColumnNames {
    username: string;
    enabled: string;
    privileges: string;
    credentialsExpired: string;
    expired: string;
    locked: string;
    role: number;
}
