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
    value?: string;
    templateName?: string;
    templateVersion?: string;
}

export interface ITemplateMatcher {
    key: string;
    matcherValue: ITemplateMatcherValue;
}
export type ITemplate = ITemplateBase;

export interface ITemplateBase {
    uuid?: string;
    name: string;
    description: string;
    version: number;
    matchers: ITemplateMatcher[];
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

export interface ITemplateMatcherColumnNames {
    type: string;
    key: string;
}

export type ITemplateAnyMatcherColumnNames = ITemplateMatcherColumnNames;

export interface ITemplateFixedMatcherColumnNames extends ITemplateMatcherColumnNames {
    value: string;
}

export interface ITemplateTemplateMatcherColumnNames extends ITemplateMatcherColumnNames {
    templateName: string;
    templateVersion: string;
}
