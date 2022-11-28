import { IPageData, IPageFilter } from './iesiGeneric.models';

export interface IFetchConnectionsListPayload {
    pagination?: IPageFilter;
    filter?: IConnectionListFilter;
    sort: string;
}

interface IConnectionListFilter {
    name?: string;
}
export interface IConnectionByNamePayload {
    name: string;
}

export interface IConnectionEntity {
    connections: IConnection[];
    page: IPageData;
}

export interface IConnection {
    name: string;
    securityGroupName: string;
    type: string;
    description: string;
    environments: IConnectionEnvironment[];
    isHandled?: boolean;
}

export interface IConnectionEnvironment {
    environment: string;
    parameters: IConnectionParameter[];
}

export interface IConnectionParameter {
    name: string;
    value: string;
}

export interface IConnectionColumnNames {
    name: string;
    description: string;
    host: string;
    port: string;
    baseUrl: string;
    tls: string;
    environment: string;
}

export interface IConnectionColumnNamesBase {
    name: string;
    securityGroupName: string;
    type: string;
    description: string;
    environments: number;
}

export interface IConnectionImportPayload {
    value: string | FormData;
}
