import { ILabel, IParameter, IPageFilter, IPageData } from './iesiGeneric.models';
import { ExecutionRequestStatus } from './executionRequestStatus.models';
import { ExecutionActionStatus } from './executionActionStatus.models';

export interface IColumnNames {
    script: string;
    version: string;
    environment: string;
    requestTimestamp: string;
    executionStatus: string;
    runStatus: string;
    labels: number;
    parameters: number;
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
}

export interface IExecutionRequestsEntity {
    executionRequests: IExecutionRequest[];
    page: IPageData;
}
