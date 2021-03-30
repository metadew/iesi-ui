export interface IComponentEntity {
    type: string;
    name: string;
    description: string;
    version: IComponentVersion;
    parameters: IComponentParameter[];
    attributes: IComponentAttribute[];

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
