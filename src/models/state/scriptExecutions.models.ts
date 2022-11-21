import { ExecutionRequestStatus } from './executionRequestStatus.models';
import { ExecutionActionStatus } from './executionActionStatus.models';
import { ILabel, IOutputValue, IParameter, IParameterRawValue } from './iesiGeneric.models';

export interface IScriptExecutionDetail {
    runId: string;
    processId: number;
    parentProcessId: number;
    scriptId: string;
    scriptName: string;
    scriptVersion: number;
    securityGroupName: string;
    environment: string;
    status: ExecutionRequestStatus | ExecutionActionStatus;
    startTimestamp: string;
    endTimestamp: string;
    inputParameters: IParameter[];
    designLabels: ILabel[];
    executionLabels: ILabel[];
    output: ILabel[];
    actions: IScriptExecutionDetailAction[];
    username: string;
    debugMode: boolean;
}

export interface IScriptExecutionDetailAction {
    runId: string;
    processId: number;
    type: string;
    name: string;
    description: string;
    condition: string;
    errorStop: boolean;
    errorExpected: boolean;
    status: ExecutionActionStatus;
    startTimestamp: string;
    endTimestamp: string;
    inputParameters: IParameterRawValue[];
    output: IOutputValue[];
}

export interface IScriptExecutionByRunIdAndProcessIdPayload {
    runId: string;
    processId: number;
}
