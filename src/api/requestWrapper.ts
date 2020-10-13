import isSet from '@snipsonian/core/es/is/isSet';
import { ONE_SECOND_IN_MILLIS } from '@snipsonian/core/es/time/periodsInMillis';
import consoleGroupLogger from '@snipsonian/browser/es/logging/consoleGroupLogger';
import { IGetRequestConfig, IBodyRequestConfig } from '@snipsonian/axios/es/request/types';
import getRequestWrapper from '@snipsonian/axios/es/request/getRequestWrapper';
import getApiLogger from '@snipsonian/axios/es/logging/getApiLogger';
import {
    ITraceableApiError,
    IErrorHandler,
    ICustomApiConfig,
} from 'models/api.models';
import { DEFAULT_TIMEOUT_IN_MILLIS } from 'config/api.config';
import { isApiLoggingEnabled } from 'config/develop.config';


interface IAuthenticationResponse {
    accessToken: string;
    expiresIn: number;
}


const apiLogger = isApiLoggingEnabled
    ? getApiLogger({ groupLogger: consoleGroupLogger })
    : undefined;

const errorHandlers: IErrorHandler[] = [];

export const registerErrorHandler = (handler: IErrorHandler) => {
    errorHandlers.push(handler);
};

let iesiApiBaseUrl: string = null;
let iesiApiTimeoutInSeconds: number = null;
let iesiApiUsername: string = null;
let iesiApiPassword: string = null;

export function setIesiApiBaseUrl(baseUrl: string) {
    iesiApiBaseUrl = baseUrl;
}

export function setIesiApiUsername(username: string) {
    iesiApiUsername = username;
}

export function setIesiApiPassword(password: string) {
    iesiApiPassword = password;
}

export function setIesiApiTimeoutInSeconds(timeoutInSeconds: number) {
    iesiApiTimeoutInSeconds = timeoutInSeconds;
}

/**
 * As the first calls (getting the env-config.json file) are definitely to the same host as the front-end,
 * there is no base url.
 * For the calls that need it afterwards (~ IEAI api calls) the baseUrl (that is retrieved from env-config.json)
 * will be added via the requestCustomTransformer.
 */
export const requestWrapper = getRequestWrapper<ICustomApiConfig, ITraceableApiError>({
    apiLogger,
    defaultBaseUrl: '',
    defaultTimeoutInMillis: DEFAULT_TIMEOUT_IN_MILLIS,
    onError: (error: ITraceableApiError) => {
        errorHandlers.reduce((acc, handler) => {
            if (!acc && handler.resolve) {
                return handler.resolve(error);
            }
            return acc;
        }, false);
        errorHandlers.forEach((handler) => handler.handle && handler.handle(error));
    },
    requestCustomTransformer: ({ request, customConfig = {} }) => {
        const {
            isIesiApi = true,
        } = customConfig;

        if (isIesiApi) {
            request.baseURL = iesiApiBaseUrl;

            if (isSet(iesiApiTimeoutInSeconds)) {
                request.timeout = iesiApiTimeoutInSeconds * ONE_SECOND_IN_MILLIS;
            }
        }

        return request;
    },
});

// TODO: add authorization call before requestWrapper.XXXX
//  add authorization header to call
//  to be removed
export function get<Result, ResponseData = Result>(
    config: IGetRequestConfig<Result, ResponseData> & ICustomApiConfig,
): Promise<Result> {
    if (config.isIesiApi) {
        const authConfig: IBodyRequestConfig<IAuthenticationResponse, IAuthenticationResponse> & ICustomApiConfig = {
            isIesiApi: true,
            url: '/users/login',
            body: {
                username: iesiApiUsername,
                password: iesiApiPassword,
            },
            mapResponse: ({ data }) => ({
                // eslint-disable-next-line no-underscore-dangle
                accessToken: data.accessToken,
                expiresIn: data.expiresIn,
            }),
        };
        return requestWrapper.post<IAuthenticationResponse>(authConfig)
            .then((response) => requestWrapper.get({
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${response.accessToken}`,
                },
            }))
            .catch();
    }
    return requestWrapper.get(config);
}

export function post<Result, ResponseData = Result>(
    config: IBodyRequestConfig<Result, ResponseData> & ICustomApiConfig,
): Promise<Result> {
    if (config.isIesiApi) {
        const authConfig: IBodyRequestConfig<IAuthenticationResponse, IAuthenticationResponse> & ICustomApiConfig = {
            isIesiApi: true,
            url: '/users/login',
            body: {
                username: iesiApiUsername,
                password: iesiApiPassword,
            },
            mapResponse: ({ data }) => ({
                // eslint-disable-next-line no-underscore-dangle
                accessToken: data.accessToken,
                expiresIn: data.expiresIn,
            }),
        };
        return requestWrapper.post<IAuthenticationResponse>(authConfig)
            .then((response) => requestWrapper.post({
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${response.accessToken}`,
                },
            }))
            .catch();
    }
    return requestWrapper.post(config);
}

export function put<Result, ResponseData = Result>(
    config: IBodyRequestConfig<Result, ResponseData> & ICustomApiConfig,
): Promise<Result> {
    if (config.isIesiApi) {
        const authConfig: IBodyRequestConfig<IAuthenticationResponse, IAuthenticationResponse> & ICustomApiConfig = {
            isIesiApi: true,
            url: '/users/login',
            body: {
                username: iesiApiUsername,
                password: iesiApiPassword,
            },
            mapResponse: ({ data }) => ({
                // eslint-disable-next-line no-underscore-dangle
                accessToken: data.accessToken,
                expiresIn: data.expiresIn,
            }),
        };
        return requestWrapper.post<IAuthenticationResponse>(authConfig)
            .then((response) => requestWrapper.put({
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${response.accessToken}`,
                },
            }))
            .catch();
    }
    return requestWrapper.put(config);
}

export function remove<Result, ResponseData = Result>(
    config: IBodyRequestConfig<Result, ResponseData> & ICustomApiConfig,
): Promise<Result> {
    if (config.isIesiApi) {
        const authConfig: IBodyRequestConfig<IAuthenticationResponse, IAuthenticationResponse> & ICustomApiConfig = {
            isIesiApi: true,
            url: '/users/login',
            body: {
                username: iesiApiUsername,
                password: iesiApiPassword,
            },
            mapResponse: ({ data }) => ({
                // eslint-disable-next-line no-underscore-dangle
                accessToken: data.accessToken,
                expiresIn: data.expiresIn,
            }),
        };
        return requestWrapper.post<IAuthenticationResponse>(authConfig)
            .then((response) => requestWrapper.remove({
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${response.accessToken}`,
                },
            }))
            .catch();
    }
    return requestWrapper.remove(config);
}
