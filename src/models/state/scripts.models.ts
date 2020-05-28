import { ReactText } from 'react';
import { IParameter } from './iesiGeneric.models';

export interface IScriptBase {
    name: string;
    description: string;
}

export interface IScriptWithVersions extends IScriptBase {
    versions: number[];
}

export interface IScript extends IScriptBase {
    version: IScriptVersion;
    parameters: IParameter[];
    actions: IScriptAction[];
}

export interface IScriptVersion {
    number: number;
    description: string;
}

export interface IScriptAction {
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
    parameters: IParameter[];
}

export interface IScriptByNamePayload {
    name: string;
}

export interface IScriptByNameAndVersionPayload extends IScriptByNamePayload {
    version: number;
}

// TODO remove this, for development only
export interface IDummyScriptAction {
    id: ReactText;
    name: string;
    description: string;
}

// TODO remove this, for development only
export interface IDummyScriptActionParameter {
    id: ReactText;
    name: string;
    description: string;
    value: string;
}
