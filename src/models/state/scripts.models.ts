import { ReactText } from 'react';
import { ILabel, IParameter, IPageFilter, IPageData } from './iesiGeneric.models';

export interface IFetchScriptsOptions {
    expandResponseWith?: IExpandScriptsResponseWith;
}

export interface IFetchScriptsListPayload extends IFetchScriptsOptions {
    pagination?: IPageFilter;
    filter?: IScriptsListFilter;
    sort: string;
}

export interface IColumnNames {
    name: string;
    securityGroupName: string;
    version: string;
    description: string;
    labels: number;
}

interface IScriptsListFilter {
    name?: string;
    version?: 'latest';
    label?: string;
}

export interface IExpandScriptsResponseWith {
    execution?: boolean; // default true
    scheduling?: boolean; // default true
}

export interface IScriptsEntity {
    scripts: IScriptBase[];
    page: IPageData;
}

export interface IScriptBase {
    name: string;
    description: string;
    securityGroupName: string;
    version: IScriptVersion;
    parameters: IParameter[];
    actions: IScriptAction[];
    labels: ILabel[];
}

export interface IScript extends IScriptBase {
    execution?: IScriptExecutionSummary;
    scheduling?: IScriptSchedule[];
}

export interface IScriptVersion {
    number: number;
    description: string;
}

export interface IScriptAction {
    number: number;
    name: string;
    type: string;
    description: string;
    component: string;
    condition: string;
    iteration: string;
    errorExpected: boolean;
    errorStop: boolean;
    retries: number;
    parameters: IParameter[];
}

export interface IScriptExecutionSummary {
    total: number;
    mostRecent: IScriptExecution[];
}

export interface IScriptExecution {
    startTimestamp: string;
    endTimestamp: string;
    runStatus: string;
    runId: string;
    environment: string;
}

export interface IScriptSchedule {
    environment: string;
    frequency: number;
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
    values?: string[];
}
