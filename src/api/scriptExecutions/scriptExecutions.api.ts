import {
    IScriptExecutionDetail,
    IScriptExecutionByRunIdAndProcessIdPayload,
} from 'models/state/scriptExecutions.models';
import { get } from 'api/requestWrapper';
import API_URLS from '../apiUrls';

export function fetchScriptExecutionDetail({
    runId,
    processId,
}: IScriptExecutionByRunIdAndProcessIdPayload) {
    return get<IScriptExecutionDetail>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.SCRIPT_EXECUTION_BY_RUN_AND_PROCESS_ID,
        pathParams: {
            runId,
            processId,
        },
    });
}
