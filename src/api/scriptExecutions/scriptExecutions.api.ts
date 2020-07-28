import { IScriptExecutionDetail } from 'models/state/scriptExecutions.models';
import { get } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchScriptExecutionDetail() {
    return get<IScriptExecutionDetail[]>({
        url: API_URLS.EXECUTION_REQUESTS,
    });
}
