import { ILabel, IPageData, IPageFilter, IParameter } from './iesiGeneric.models';
import { ExecutionRequestStatus } from './executionRequestStatus.models';
import { ExecutionActionStatus } from './executionActionStatus.models';

export interface IColumnNames {
    script: string;
    version: string;
    securityGroupName: string;
    environment: string;
    requestTimestamp: string;
    executionStatus: string;
    runStatus: string;
    labels: number;
    parameters: number;
    runId: string;
    requester?: string;
}

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
    debugMode: boolean;
}

export interface ICreateExecutionRequestPayload {
    name: string;
    description: string;
    scope: string;
    context: string;
    email: string;
    debugMode: boolean;
    // eslint-disable-next-line max-len
    scriptExecutionRequests: ICreateScriptExecutionRequestPayload[];
    executionRequestLabels: ILabel[];
}

interface ICreateScriptExecutionRequestPayload {
    environment: string;
    impersonations: { name: string }[];
    parameters: IParameter[];
    scriptName: string;
    scriptVersion: number;
}

interface IScriptExecutionRequest {
    scriptExecutionRequestId: string;
    executionRequestId: string;
    environment: string;
    impersonations: { name: string }[];
    parameters: IParameter[];
    scriptExecutionRequestStatus: ExecutionRequestStatus;
    scriptName: string;
    scriptVersion: number;
    securityGroupName: string;
    runId?: string;
    runStatus?: ExecutionActionStatus;
}

export interface IExecutionRequestByIdPayload {
    id: string;
}

export interface IFetchExecutionRequestListPayload {
    pagination?: IPageFilter;
    filter?: IFetchExecutionRequestListFilter;
    sort: string;
}

interface IFetchExecutionRequestListFilter {
    script?: string;
    version?: string;
    label?: string;
    environment?: string;
    'run-id'?: string;
    'run-status'?: string;
    requester?: string;
}

export interface IExecutionRequestsEntity {
    executionRequests: IExecutionRequest[];
    page: IPageData;
}
