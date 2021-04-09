export interface IConnectionEntity {
    name: string;
    type: string;
    description: string;
    environment: string;
    parameters: IConnectionParameter[];
    isHandled: boolean;
}

export interface IConnectionParameter {
    name: string;
    value: string;
}

export interface IConnectionColumnNames {
    name: string;
    description: string;
    host: string;
    baseUrl: string;
    tls: string;
    environment: string;
}
