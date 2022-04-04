interface IConstant {
    name: string;
    description: string;
    status: string;
    parameters: IConstantParameter[];
}

export interface IConstantParameter {
    name: string;
    description: string;
    type: string;
    mandatory: boolean;
    encrypted: boolean;
}

export interface IActionType {
    name: string;
    type: string;
    status: string;
    parameters: IConstantParameter[];
    category: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConnectionType {
    name: string;
    type: string;
    parameters: IConstantParameter[];
    category: string;
}

export interface IEnvironmentType {
    name: string;
    description: string;
    parameters: IConstantParameter[];
}

export interface IComponentType {
    name: string;
    type: string;
    parameters: IConstantParameter[];
    category: string;
}

export interface IComponentTypeFilters {
    name: string;
}
