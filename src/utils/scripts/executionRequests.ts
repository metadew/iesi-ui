import { ExecutionRequestStatus } from 'models/state/executionRequests.models';

export function isExecutionRequestStatusNewOrSubmitted(status: ExecutionRequestStatus) {
    return status === ExecutionRequestStatus.New || status === ExecutionRequestStatus.Submitted;
}
