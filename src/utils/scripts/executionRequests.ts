import { ExecutionRequestStatus } from 'models/state/executionRequests.models';

export function isExecutionRequestStatusPending(status: ExecutionRequestStatus) {
    return (
        status !== ExecutionRequestStatus.Declined
        && status !== ExecutionRequestStatus.Completed
        && status !== ExecutionRequestStatus.Aborted
    );
}

export function isExecutionRequestStatusFailed(status: ExecutionRequestStatus) {
    return status === ExecutionRequestStatus.Stopped
        || status === ExecutionRequestStatus.Declined
        || status === ExecutionRequestStatus.Killed
        || status === ExecutionRequestStatus.Unknown;
}
