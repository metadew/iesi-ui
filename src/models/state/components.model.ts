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

export interface IComponent {
    [key: string]: string | IComponentVersion | IComponentParameter[] | IComponentAttribute[] | boolean;
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
}
