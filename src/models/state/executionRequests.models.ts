export interface IExecutionRequest {
    executionRequestId: string;
    requestTimestamp: Date;
    name: string;
    description: string;
    scope: string;
    context: string;
    email: string;
    executionRequestStatus: TExecutionRequestStatus;
    scriptExecutionRequests: IScriptExecutionRequest[];
}

type TExecutionRequestStatus = 'NEW';

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

export interface IFetchExecutionRequestByIdPayload {
    id: string;
}
