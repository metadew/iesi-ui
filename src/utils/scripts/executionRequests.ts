import { ExecutionRequestStatus } from 'models/state/executionRequests.models';

export function isExecutionRequestStatusPending(status: ExecutionRequestStatus) {
    return status === ExecutionRequestStatus.New || status === ExecutionRequestStatus.Submitted;
}

export function isExecutionRequestStatusFailed(status: ExecutionRequestStatus) {
    return status === ExecutionRequestStatus.Stopped
        || status === ExecutionRequestStatus.Declined
        || status === ExecutionRequestStatus.Killed
        || status === ExecutionRequestStatus.Unknown;
}
