import { IPageData, IPageFilter } from "./iesiGeneric.models";

export interface IFetchDatasetsListPayload {
    pagination?: IPageFilter;
    filter?: IDatasetListFilter;
    sort: string;
}

interface IDatasetListFilter {
    name?: string;
}
export interface IDatasetBase {
    name: string;
    securityGroupName: string;
    implementations: IDatasetImplementation[];
}

export interface IDataset extends IDatasetBase {
    uuid: string;
}

export interface IDatasetEntity {
    datasets: IDataset[];
    page: IPageData;
}

export interface IDatasetColumnNames {
    name: string;
    securityGroupName: string;
    implementations: number;
}

export interface IDatasetImplementation {
    type: string;
    labels: IDatasetImplementationLabel[];
    keyValues: IKeyValue[];
}

export interface IDatasetImplementationLabel {
    label: string;
}

export interface IDatasetImplementationColumn {
    labels: string;
}
export interface IKeyValueBase {
    key: string;
    value: string;
}

export interface IKeyValue extends IKeyValueBase {
    id: number;
}

export interface IDatasetByNamePayload {
    name: string;
}
export interface IDatasetImplementationsByUuidPayload {
    uuid: string;
}