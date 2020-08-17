import { ILabel, IParameter } from './iesiGeneric.models';

export interface IExecutionRequest {
    executionRequestId: string;
    requestTimestamp: Date; // format 2020-05-04T10:01:13.923Z
    name: string;
    description: string;
    scope: string;
    context: string;
    email: string;
    executionRequestStatus: ExecutionRequestStatus;
    scriptExecutionRequests: IScriptExecutionRequest[];
    executionRequestLabels: ILabel[];
}

export interface ICreateExecutionRequestPayload {
    name: string;
    description: string;
    scope: string;
    context: string;
    email: string;
    // eslint-disable-next-line max-len
    scriptExecutionRequests: Omit<IScriptExecutionRequest, 'executionRequestId' | 'scriptExecutionRequestId' | 'scriptExecutionRequestStatus'>[];
    executionRequestLabels: ILabel[];
}

interface IScriptExecutionRequest {
    scriptExecutionRequestId: string;
    executionRequestId: string;
    environment: string;
    exit: boolean;
    impersonations: { name: string }[];
    parameters: IParameter[];
    scriptExecutionRequestStatus: ExecutionRequestStatus;
    scriptName: string;
    scriptVersion: number;
}

export interface IExecutionRequestByIdPayload {
    id: string;
}

export enum ExecutionRequestStatus {
    New = 'NEW',
    Submitted = 'SUBMITTED',
    Aborted = 'ABORTED',
    Declined = 'DECLINED',
    Accepted = 'ACCEPTED',
    Completed = 'COMPLETED',
}
