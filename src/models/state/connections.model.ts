export interface IConnectionEntity {
    name: string;
    type: string;
    description: string;
    environment: string;
    parameters: IConnectionParameter;
}

export interface IConnectionParameter {
    name: string;
    value: string;
}
