export interface IScriptResult {
    runID: string;
    processId: number;
    parentProcessId: number;
    scriptId: string;
    scriptName: string;
    scriptVersion: number;
    environment: string;
    status: string;
    startTimestamp: string;
    endTimestamp: string;
}

export interface IRunIdPayload {
    runId: string;
}

export interface IRunAndProcessIdPayload extends IRunIdPayload {
    processId: string;
}
