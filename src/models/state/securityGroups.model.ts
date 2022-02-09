import { IPageData, IPageFilter } from './iesiGeneric.models';

export interface IFetchSecurityGroupListPayload {
    pagination?: IPageFilter;
    filter?: ISecurityGroupsListFilter;
    sort: string;
}

export interface ISecurityGroupsListFilter {
    name?: string;
}

export interface ISecurityGroupByNamePayload {
    name: string;
}

export interface ISecurityGroupByIdPayload {
    id: string;
}

export interface ISecurityGroupAssignTeamPayload {
    id: string;
    teamId: string;
}

export interface ISecurityGroupEntity {
    securityGroups: ISecurityGroup[];
    page: IPageData;
}

export interface ISecurityGroup extends ISecurityGroupBase { }

export interface ISecurityGroupBase {
    id?: string;
    name: string;
    teams: ISecurityGroupTeam[];
    securedObjects: [];
}

export interface ISecurityGroupTeam {
    id: string;
    teamName: string;
}

export interface ISecurityGroupPost {
    name: string;
}

export interface ISecurityGroupColumnNames {
    name: string;
    teams: number;
}

export interface ISecurityGroupTeamColumnNames {
    teamName: string;
}