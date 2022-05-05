import { IParameter, IPageData, IPageFilter } from './iesiGeneric.models';

export interface IFetchEnvironmentsListPayload {
    pagination?: IPageFilter;
    filter?: IEnvironmentListFilter;
    sort: string;
}

interface IEnvironmentListFilter {
    name?: string;
}

export interface IEnvironmentByNamePayload {
    name: string;
}

export interface IEnvironmentEntity {
    environments: IEnvironment[];
    page: IPageData;
}

export interface IEnvironment {
    name: string;
    description: string;
    parameters?: IEnvironmentParameter[];
}
export interface IEnvironmentParameter {
    [key: string]: string;
    name: string;
    value: string;
}
export interface IEnvironmentColumnNamesBase {
    name: string;
    description: string;
    parameters: number;
}

