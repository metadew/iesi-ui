import { IUser, IUserByIdPayload } from 'models/state/auth.models';
import { get, post } from '../requestWrapper';
import API_URLS from '../apiUrls';

export interface IAuthenticationRequest {
    username: string;
    password: string;
}
export interface IAuthenticationResponse {
    'access_token': string;
    'refresh_token': string;
    'expire_in': number;
    'scope': string;
    'jti': string;
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
            expire_in: data.expire_in,
            scope: data.scope,
            jti: data.jti,
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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
