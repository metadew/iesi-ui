import { ExecutionRequestStatus, ExecutionActionStatus } from './executionenumstatus';
import { ILabel, IParameter, IPageFilter, IPageData } from './iesiGeneric.models';
// import { ExecutionActionStatus } from './scriptExecutions.models';


export interface IColumnNames {
    script: string;
    version: string;
    environment: string;
    requestTimestamp: string;
    executionStatus: string;
    labels: number;
    parameters: number;
    runStatus: string;
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
    scriptExecutionRequests: Omit<IScriptExecutionRequest, 'executionRequestId' | 'scriptExecutionRequestId' | 'scriptExecutionRequestStatus' | 'runStatus'>[];
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
    runStatus: ExecutionActionStatus;
}

export interface IExecutionRequestByIdPayload {
    id: string;
}

/* export enum ExecutionRequestStatus {
    New = 'NEW',
    Submitted = 'SUBMITTED',
    Accepted = 'ACCEPTED',
    Declined = 'DECLINED',
    Stopped = 'STOPPED',
    Completed = 'COMPLETED',
    Killed = 'KILLED',
    Unknown = 'UNKNOWN',
} */

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
