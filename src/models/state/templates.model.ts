import { ISecuredObject } from 'models/core.models';
import { IPageData, IPageFilter } from './iesiGeneric.models';

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
    type: string;
}

export interface ITemplateFixedMatcherValue {
    value: string;
}

export interface ITemplateTemplateMatcherValue {
    templateName: string;
    templateVersion: string;
}

export interface ITemplateMatchers {
    key: string;
    matcherValue: ITemplateMatcherValue[];
}
export type ITemplate = ITemplateBase;

export interface ITemplateBase extends ISecuredObject {
    uuid?: string;
    name: string;
    description: string;
    version: number;
    matchers: ITemplateMatchers[];
}

export interface ITemplateEntity {
    templates: ITemplate[];
    page: IPageData;
}

export interface ITemplateColumnNames {
    name: string;
    description: string;
    version: number;
    matchers: number;
}
