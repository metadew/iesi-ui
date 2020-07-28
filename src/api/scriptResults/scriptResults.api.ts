import { IScriptResult, IRunIdPayload, IRunAndProcessIdPayload } from 'models/state/scriptResults.models';
import { IListResponse } from 'models/state/iesiGeneric.models';
import { get } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchScriptResults() {
    return get<IScriptResult[], IListResponse<IScriptResult>>({
        url: API_URLS.SCRIPT_RESULTS,
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
    });
}

export function fetchScriptResultsForRunId({ runId }: IRunIdPayload) {
    return get<IScriptResult[], IListResponse<IScriptResult>>({
        url: API_URLS.SCRIPT_RESULTS_BY_RUN_ID,
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
        pathParams: {
            runId,
        },
    });
}

export function fetchScriptResult({ runId, processId }: IRunAndProcessIdPayload) {
    return get<IScriptResult>({
        url: API_URLS.SCRIPT_RESULT_BY_RUN_AND_PROCESS_ID,
        pathParams: {
            runId,
            processId,
        },
    });
}
