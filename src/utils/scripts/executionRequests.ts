import { ExecutionRequestStatus } from 'models/state/executionRequestStatus.models';

export function isExecutionRequestStatusPending(status: ExecutionRequestStatus) {
    return status === ExecutionRequestStatus.New || status === ExecutionRequestStatus.Submitted;
}

export function isExecutionRequestStatusFailed(status: ExecutionRequestStatus) {
    return status === ExecutionRequestStatus.Stopped
        || status === ExecutionRequestStatus.Declined
        || status === ExecutionRequestStatus.Killed
        || status === ExecutionRequestStatus.Unknown;
}
