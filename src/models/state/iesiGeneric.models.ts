export interface IListResponse<Data> {
    _embedded: Data[];
}

export interface IParameter {
    name: string;
    value: string;
}

export interface IParameterRawValue {
    name: string;
    rawValue: string;
    resolvedValue: string;
}

export interface ILabel {
    name: string;
    value: string;
}

export interface IOutputValue {
    name: string;
    value: string;
}

export interface IPageFilter {
    page: number;
    size?: number;
}

export interface IPageData {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}
