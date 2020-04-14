export interface IScriptBase {
    name: string;
    description: string;
}

export interface IScriptNamed extends IScriptBase {
    versions: number[];
}

export interface IScript extends IScriptBase {
    version: IScriptVersion;
    parameters: IScriptParameter[];
    actions: IScriptAction[];
}

interface IScriptVersion {
    number: number;
    description: string;
}

interface IScriptParameter {
    name: string;
    value: string;
}

interface IScriptAction {
    retries: number;
    iteration: string;
    condition: string;
    number: number;
    name: string;
    description: string;
    component: string;
    errorExpected: boolean;
    errorStop: boolean;
    type: string;
    parameters: IScriptParameter[];
}

export interface IFetchScriptByNamePayload {
    name: string;
}

export interface IFetchScriptByNameAndVerionPayload extends IFetchScriptByNamePayload {
    version: number;
}
