import { ExecutionRequestStatus } from 'models/state/executionRequests.models';

export function isExecutionRequestStatusNewOrSubmitted(status: ExecutionRequestStatus) {
    return status === ExecutionRequestStatus.New || status === ExecutionRequestStatus.Submitted;
}

export function isExecutionRequestStatusAbortedOrDeclined(status: ExecutionRequestStatus) {
    return status === ExecutionRequestStatus.Aborted || status === ExecutionRequestStatus.Declined;
}
