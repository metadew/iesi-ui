export interface IComponentEntity {
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
