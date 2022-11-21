// eslint-disable-next-line import/no-cycle
import { getAsyncEnvConfig } from 'state/envConfig/selectors';
// eslint-disable-next-line import/no-cycle
import { getStore } from 'state';
// eslint-disable-next-line import/no-cycle
import { get, post } from '../requestWrapper';
import API_URLS from '../apiUrls';

export interface IAuthenticationRequest {
    username: string;
    password: string;
}
export interface IAuthenticationResponse {
    // eslint-disable-next-line camelcase
    access_token: string;
    // eslint-disable-next-line camelcase
    refresh_token: string;
    // eslint-disable-next-line camelcase
    expires_in: number;
    jti: string;
    scope: string;
    // eslint-disable-next-line camelcase
    token_type: string;
}

export function logon(credentials: IAuthenticationRequest) {
    const envConfig = getAsyncEnvConfig(getStore().getState()).data;
    return post<IAuthenticationResponse, IAuthenticationResponse>({
        isIesiApi: true,
        needsAuthentication: false,
        url: API_URLS.USER_LOGON,
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            jti: data.jti,
            scope: data.scope,
            token_type: data.token_type,
            roles: [],
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'password',
            username: credentials.username,
            password: credentials.password,
            client_id: envConfig.iesi_api_client_id,
            client_secret: envConfig.iesi_api_client_secret,
        }),
    });
}

// eslint-disable-next-line camelcase,@typescript-eslint/camelcase
export function refreshToken(refresh_token: string) {
    const envConfig = getAsyncEnvConfig(getStore().getState()).data;
    return post<IAuthenticationResponse, IAuthenticationResponse>({
        isIesiApi: true,
        needsAuthentication: false,
        url: API_URLS.USER_LOGON,
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            jti: data.jti,
            scope: data.scope,
            token_type: data.token_type,
            roles: [],
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: envConfig.iesi_api_client_id,
            client_secret: envConfig.iesi_api_client_secret,
            refresh_token,
        }),
    });
}

// eslint-disable-next-line camelcase, @typescript-eslint/camelcase
export function checkAccessToken(access_token: string) {
    // eslint-disable-next-line camelcase
    return get<{ error: string; error_description: string}, { error: string; error_description: string}>({
        isIesiApi: true,
        needsAuthentication: false,
        // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
        url: `${API_URLS.USER_CHECK_TOKEN}?token=${access_token}`,
        mapResponse: ({ data }) => data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },

    });
}
