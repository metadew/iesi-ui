import { IPageData, IPageFilter } from './iesiGeneric.models';
import {ISecuredObject} from "models/core.models";
import {IComponentAttribute, IComponentParameter, IComponentVersion} from "models/state/components.model";
import {ISecurityGroupBase} from "models/state/securityGroups.model";

export interface IFetchTemplatesListPayload {
    pagination?: IPageFilter;
    filter?: ITemplateListFilter;
    sort: string;
}

interface ITemplateListFilter {
    name?: string;
}

export interface ITemplateByNamePayload {
    name: string;
}
export interface ITemplateByIdPayload {
    id: string;
}
export interface ITemplateMatcherValue {
    type: string,

}

export interface ITemplateMatchers {
    key: string;
    matcherValue: ITemplateMatcherValue[],
}
export type ITemplate = ITemplateBase;

export interface ITemplateBase extends ISecuredObject {
    id?: string;
    name: string;
    description: string;
    version: ITemplateVersion;
    matchers: ITemplateMatchers[];
}

export interface ITemplateVersion {
    number: number;
    description: string;
}

export interface ITemplateEntity {
    templates: ITemplate[];
    page: IPageData;
}

export interface ITemplateColumnNames {
    name: string;
    securityGroupName: string;
    implementations: number;
}
