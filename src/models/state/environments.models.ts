import { IParameter, IPageData } from './iesiGeneric.models';


export interface IEnvironmentColumnNamesBase {
    name: string;
    description: string;
    parameters: number;
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
    parameters?: IParameter[];
}