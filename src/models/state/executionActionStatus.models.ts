export enum ExecutionActionStatus {
    Success = 'SUCCESS',
    Error = 'ERROR',
    Warning = 'WARNING',
    Stopped = 'STOPPED',
    Skipped = 'SKIPPED',
    Unknown = 'UNKNOWN',
}

export const getScriptExecutionStatusForDropdown = () => {
    const scriptExecutionStatus = Object.values(ExecutionActionStatus);
    return scriptExecutionStatus.map((status) => status);
};
