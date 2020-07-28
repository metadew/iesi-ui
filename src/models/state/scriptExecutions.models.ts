import { IParameterRawValue, ILabel, IOutputValue } from './iesiGeneric.models';

export interface IScriptExecutionDetail {
    runId: string;
    processId: string;
    parentProcessId: number;
    scriptId: string;
    scriptName: string;
    scriptVersion: number;
    environment: string;
    status: string;
    startTimestamp: string;
    endTimestamp: string;
    inputParameters: IParameterRawValue[];
    designLabels: ILabel[];
    executionLabels: ILabel[];
    output: ILabel[];
    actions: IScriptExecutionDetailAction[];
}

export interface IScriptExecutionDetailAction {
    runId: string;
    processId: number;
    type: string;
    name: string;
    description: string;
    condition: string;
    errorStop: true;
    errorExpected: true;
    status: string;
    startTimestamp: string;
    endTimestamp: string;
    inputParameters: IParameterRawValue[];
    output: IOutputValue[];
}
