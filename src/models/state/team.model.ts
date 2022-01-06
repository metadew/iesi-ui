import { IPageData, IPageFilter } from "./iesiGeneric.models";

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

export interface ITeamEntity {
    teams: ITeam[];
    page: IPageData;
}

export type ITeamNames = Array<string>;

export interface ITeam extends ITeamBase {}
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
    privileges: ITeamPrivilege[]
}

export interface ITeamPrivilege {
    uuid: string;
    privilege: string;
}
