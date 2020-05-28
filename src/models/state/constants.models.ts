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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IActionType extends IConstant {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IConnectionType extends IConstant {}
