import { IUser, IUserByIdPayload } from 'models/state/auth.models';
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
            username: credentials.username,
            password: credentials.password,
            client_id: 'iesi',
            client_secret: 'iesi',
            grant_type: 'password',
        }),
    });
}

// eslint-disable-next-line camelcase,@typescript-eslint/camelcase
export function refreshToken(refresh_token: string) {
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
            client_id: 'iesi',
            client_secret: 'iesi',
            refresh_token,
            grant_type: 'refresh_token',
        }),
    });
}

export function fetchUserByUuid({ uuid }: IUserByIdPayload) {
    return get<IUser>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.USER_BY_ID,
        pathParams: {
            uuid,
        },
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data,
    });
}
