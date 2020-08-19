import { IUrlParams } from '@snipsonian/core/src/url/types';
import {
    IFetchScriptsOptions,
    IScriptBase,
    IScript,
    IScriptByNamePayload,
    IScriptByNameAndVersionPayload, IExpandScriptsResponseWith, IFetchScriptsListPayload, IScriptsEntity,
} from 'models/state/scripts.models';
import { IListResponse } from 'models/state/iesiGeneric.models';
import { get, post, put, remove } from '../requestWrapper';
import API_URLS from '../apiUrls';

/**
 * TODO This call currently returns a separate item for each version of a script.
 * But in the edit-list we only show the latest version of a script.
 * --> ideally Robbe adds a query param to conditionally get only the latest script versions
 *     otherwise we have to filter them ourselves
 */
export function fetchScripts({ expandResponseWith, pagination, filter }: IFetchScriptsListPayload) {
    const pageSize = pagination.size || 20;
    // TODO remove mock, correct ListResponse typing
    return get<IScriptsEntity, IListResponse<IScript>>({
        url: API_URLS.SCRIPTS,
        queryParams: {
            ...toExpandQueryParam(expandResponseWith),
            ...pagination,
            ...filter,
        },
        mapResponse: ({ data }) => ({
        // eslint-disable-next-line no-underscore-dangle
            scripts: data._embedded.length <= pageSize ? data._embedded : data._embedded.slice(0, pageSize),
            page: {
                size: pageSize,
                // eslint-disable-next-line no-underscore-dangle
                totalElements: data._embedded.length,
                // eslint-disable-next-line no-underscore-dangle
                totalPages: Math.ceil(data._embedded.length / pageSize),
                number: pagination.page,
            },
        }),
    });
}

export function fetchScriptVersions({
    name,
    expandResponseWith,
}: IScriptByNamePayload & IFetchScriptsOptions) {
    return get<IScript[], IListResponse<IScript>>({
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
        url: API_URLS.SCRIPT_BY_NAME_VERSION,
        pathParams: {
            name,
            version,
        },
        queryParams: toExpandQueryParam(expandResponseWith),
    });
}

/**
 * Makes a new 'script-version-combo', which can either be the first version of a totally new script,
 * OR an extra version of an existing script.
 */
export function createScriptVersion(script: IScriptBase) {
    return post<IScriptBase>({
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
        url: API_URLS.SCRIPT_BY_NAME,
        pathParams: {
            name,
        },
    });
}

export function deleteScriptVersion({ name, version }: IScriptByNameAndVersionPayload) {
    return remove<{}>({
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
