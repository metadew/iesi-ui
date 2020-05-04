export interface IListResponse<Data> {
    _embedded: Data[];
}

export interface IParameter {
    name: string;
    value: string;
}
