export interface IExecutionRequest {
    executionRequestId: string;
    requestTimestamp: Date; // format 2020-05-04T10:01:13.923Z
    name: string;
    description: string;
    scope: string;
    context: string;
    email: string;
    executionRequestStatus: TExecutionRequestStatus;
    scriptExecutionRequests: IScriptExecutionRequest[];
}

type TExecutionRequestStatus = 'NEW'; // TODO

interface IScriptExecutionRequest {
    scriptExecutionRequestId: string;
    executionRequestId: string;
    actionSelect: number[];
    exit: boolean;
    impersonation: string;
    environment: string;
    impersonations: { [additionalProp: string]: string };
    parameters: { [additionalProp: string]: string };
    scriptExecutionRequestStatus: TExecutionRequestStatus;
    scriptName: string;
    scriptVersion: number;
}

export interface IExecutionRequestByIdPayload {
    id: string;
}
