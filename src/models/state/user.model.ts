import { IPageData, IPageFilter } from "./iesiGeneric.models";

export interface IFetchUsersListPayload {
    pagination?: IPageFilter;
    filter?: IUsersListFilter;
    sort: string;
}

export interface IUsersListFilter {
    username?: string;
}

export interface IUserByNamePayload {
    name: string;
}

export interface IUserByIdPayload {
    id: string;
}

export interface IUserEntity {
    users: IUser[]
    page: IPageData;
}

export interface IUser extends IUserBase {
    teams: string[];
}

export interface IUserBase {
    id: string;
    username: string;
    enabled: boolean;
    expired: boolean;
    credentialsExpired: boolean;
    locked: boolean;
    roles: IUserRole[];
}

export interface IUserRole {
    id: string;
    name: string;
    team: IUserTeam;
    privileges: IUserPrivilege[];
}

export interface IUserTeam {
    id: string;
    name: string;
    securityGroups:IUserSecurityGroup[];
}

export interface IUserSecurityGroup {
    id: string;
    name:string;
}

export interface IUserPrivilege {
    uuid: string;
    privilege: string;
}

export interface IUserColumnName {
    username: string;
    enabled: string;
    expired: string;
    locked: string;
    teams: number;
}