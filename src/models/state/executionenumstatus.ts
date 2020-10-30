/* eslint-disable eol-last */

export enum ExecutionActionStatus {
    Success = 'SUCCESS',
    Error = 'ERROR',
    Warning = 'WARNING',
    Stopped = 'STOPPED',
    Skipped = 'SKIPPED',
    Unknown = 'UNKNOWN',
}

export enum ExecutionRequestStatus {
    New = 'NEW',
    Submitted = 'SUBMITTED',
    Accepted = 'ACCEPTED',
    Declined = 'DECLINED',
    Stopped = 'STOPPED',
    Completed = 'COMPLETED',
    Killed = 'KILLED',
    Unknown = 'UNKNOWN',
}