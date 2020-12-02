import { IUrlParams } from '@snipsonian/core/src/url/types';
import {
    IFetchScriptsOptions,
    IScriptBase,
    IScript,
    IScriptByNamePayload,
    IScriptByNameAndVersionPayload, IExpandScriptsResponseWith, IFetchScriptsListPayload, IScriptsEntity,
} from 'models/state/scripts.models';
import { IListResponse, IPageData } from 'models/state/iesiGeneric.models';
import { saveAs } from 'file-saver';
import { get, post, put, remove } from '../requestWrapper';
import API_URLS from '../apiUrls';

interface IScriptsResponse {
    _embedded: {
        scripts: IScript[];
    };
    page: IPageData;
}

export function fetchScripts({ expandResponseWith, pagination, filter, sort }: IFetchScriptsListPayload) {
    return get<IScriptsEntity, IScriptsResponse>({
        isIesiApi: true,
        url: API_URLS.SCRIPTS,
        queryParams: {
            ...toExpandQueryParam(expandResponseWith),
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            scripts: data._embedded.scripts,
            page: data.page,
        }),
    });
}

export function fetchScriptVersions({
    name,
    expandResponseWith,
}: IScriptByNamePayload & IFetchScriptsOptions) {
    return get<IScript[], IListResponse<IScript>>({
        isIesiApi: true,
        url: API_URLS.SCRIPT_BY_NAME,
        pathParams: {
            name,
        },
        queryParams: toExpandQueryParam(expandResponseWith),
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data._embedded,
    });
}

export function fetchScriptVersion({
    name,
    version,
    expandResponseWith,
}: IScriptByNameAndVersionPayload & IFetchScriptsOptions) {
    return get<IScript>({
        isIesiApi: true,
        url: API_URLS.SCRIPT_BY_NAME_VERSION,
        pathParams: {
            name,
            version,
        },
        queryParams: toExpandQueryParam(expandResponseWith),
    });
}

export async function fetchScriptByNameAndVersionDownload({
    name,
    version,
    expandResponseWith,
}: IScriptByNameAndVersionPayload & IFetchScriptsOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return get<any>({
        isIesiApi: true,
        url: API_URLS.SCRIPT_BY_NAME_VERSION_DOWNLOAD,
        responseType: 'blob',
        pathParams: {
            name,
            version,
        },
        queryParams: toExpandQueryParam(expandResponseWith),
    }).then((response) => {
        const blob = new Blob([response]);
        // eslint-disable-next-line
        saveAs(blob, 'script_' + name + '_' + version + '.json');
    });
}

/**
 * Makes a new 'script-version-combo', which can either be the first version of a totally new script,
 * OR an extra version of an existing script.
 */
export function createScriptVersion(script: IScriptBase) {
    return post<IScriptBase>({
        isIesiApi: true,
        url: API_URLS.SCRIPTS,
        body: script,
    });
}

/**
 * Updates an existing 'script-version-combo'. This will NOT make a new version of the script,
 * but just updates the fields of the existing one.
 */
export function updateScriptVersion(script: IScriptBase) {
    return put<IScriptBase>({
        isIesiApi: true,
        url: API_URLS.SCRIPT_BY_NAME_VERSION,
        pathParams: {
            name: script.name,
            version: script.version.number,
        },
        body: script,
    });
}

export function deleteScriptVersions({ name }: IScriptByNamePayload) {
    return remove<{}>({
        isIesiApi: true,
        url: API_URLS.SCRIPT_BY_NAME,
        pathParams: {
            name,
        },
    });
}

export function deleteScriptVersion({ name, version }: IScriptByNameAndVersionPayload) {
    return remove<{}>({
        isIesiApi: true,
        url: API_URLS.SCRIPT_BY_NAME_VERSION,
        pathParams: {
            name,
            version,
        },
    });
}

function toExpandQueryParam(expandScriptsResponseWith: IExpandScriptsResponseWith = {}): IUrlParams {
    const {
        execution = true,
        scheduling = true,
    } = expandScriptsResponseWith;

    const expandItems: string[] = [];
    if (execution) {
        expandItems.push('execution');
    }
    if (scheduling) {
        expandItems.push('scheduling');
    }

    if (expandItems.length === 0) {
        return {};
    }

    return {
        expand: expandItems.join(','),
    };
}
