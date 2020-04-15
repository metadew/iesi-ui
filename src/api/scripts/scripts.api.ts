import { IScriptBase, IScriptNamed, IScript, IFetchScriptByNamePayload, IFetchScriptByNameAndVerionPayload } from 'models/state/scripts.models';
import { get } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchScripts() {
    return get<IScriptBase[]>({
        url: API_URLS.FETCH_SCRIPTS,
    });
}

export function fetchScriptByName({
    name,
}: IFetchScriptByNamePayload) {
    return get<IScriptNamed>({
        url: API_URLS.FETCH_SCRIPT_BY_NAME,
        pathParams: {
            name,
        },
    });
}

export function fetchScriptByNameVersion({
    name,
    version,
}: IFetchScriptByNameAndVerionPayload) {
    return get<IScript>({
        url: API_URLS.FETCH_SCRIPT_BY_NAME_VERSION,
        pathParams: {
            name,
            version,
        },
    });
}
