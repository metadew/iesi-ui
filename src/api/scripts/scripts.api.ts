import {
    IScriptBase,
    IScriptWithVersions,
    IScript,
    IScriptByNamePayload,
    IScriptByNameAndVersionPayload,
} from 'models/state/scripts.models';
import { IListResponse } from 'models/state/iesiGeneric.models';
import { get, post, put, remove } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchScripts() {
    return get<IScriptBase[], IListResponse<IScriptBase>>({
        url: API_URLS.SCRIPTS,
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
    });
}

export function fetchScriptVersions({ name }: IScriptByNamePayload) {
    return get<IScriptWithVersions>({
        url: API_URLS.SCRIPT_BY_NAME,
        pathParams: {
            name,
        },
    });
}

export function fetchScript({ name, version }: IScriptByNameAndVersionPayload) {
    return get<IScript>({
        url: API_URLS.SCRIPT_BY_NAME_VERSION,
        pathParams: {
            name,
            version,
        },
    });
}

export function createScript(script: IScript) {
    return post<IScript>({
        url: API_URLS.SCRIPTS,
        body: script,
    });
}

export function updateScript(script: IScript) {
    return put<IScript>({
        url: API_URLS.SCRIPT_BY_NAME_VERSION,
        pathParams: {
            name: script.name,
            version: script.version.number,
        },
        body: script,
    });
}

export function deleteScript({ name, version }: IScriptByNameAndVersionPayload) {
    return remove<{}>({
        url: API_URLS.SCRIPT_BY_NAME_VERSION,
        pathParams: {
            name,
            version,
        },
    });
}
