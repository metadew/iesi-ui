import { ISecuredObject } from 'models/core.models';
import { IPageData, IPageFilter } from './iesiGeneric.models';

export interface IFetchComponentsListPayload {
    pagination?: IPageFilter;
    filter?: IComponentListFilter;
    sort: string;
}

interface IComponentListFilter {
    name?: string;
}
export interface IComponentByNamePayload {
    name: string;
}

export interface IComponentByNameAndVersionPayload extends IComponentByNamePayload {
    version: number;
}

export interface IComponentEntity {
    components: IComponent[];
    page: IPageData;
}

export interface IComponent extends ISecuredObject {
    type: string;
    name: string;
    description: string;
    version: IComponentVersion;
    parameters: IComponentParameter[];
    attributes: IComponentAttribute[];
    isHandled: boolean;
}
export interface IComponentVersion {
    number: number;
    description: string;
}

export interface IComponentParameter {
    [key: string]: string;
    name: string;
    value: string;
}

export interface IComponentAttribute {
    environment: string;
    name: string;
    value: string;
}

export interface IComponentColumnNames {
    name: string;
    securityGroupName: string;
    description: string;
    version: string;
    endpoint: string;
    type: string;
    connection: string;
}

export interface IComponentColumnNamesBase {
    name: string;
    description: string;
    version: string;
    type: string;
    securityGroupName: string;
}

export interface IComponentImportPayload {
    value: string | FormData;
}
