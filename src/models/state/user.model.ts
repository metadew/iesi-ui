import { IPageFilter } from "./iesiGeneric.models";

export interface IFetchUsersListPayload {
    pagination?: IPageFilter;
    filter?: IUsersListFilter;
    sort: string;
}

export interface IUsersListFilter {
    name?: string;
}

export interface IUserByNamePayload {
    name: string;
}

export interface IUserByIdPayload {
    id: string;
}

export interface IUserEntity {
    users: IUser[]
}

export interface IUser extends IUserBase {
    id: string;
}

export interface IUserBase {
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