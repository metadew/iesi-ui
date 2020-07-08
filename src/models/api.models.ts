import { ITraceableApiErrorBase } from '@snipsonian/core/es/typings/apiErrors';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITraceableApiError extends ITraceableApiErrorBase<IErrorResponseData> {}

/**
 * The error data model - returned by the backend api
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IErrorResponseData {
    message: string;
    error: string;
    timestamp: string;
    status: number;
}

export interface ICustomApiConfig {
    isIesiApi?: boolean; // default true
    // TODO add e.g. addAuthorizationHeader boolean once authentication needed
}

export interface IErrorHandler {
    resolve?: (error: ITraceableApiError) => boolean;
    handle?: (error: ITraceableApiError) => void;
}
