import { IUser, IUserByIdPayload, IUserRole } from 'models/state/auth.models';
import { get, post } from '../requestWrapper';
import API_URLS from '../apiUrls';

export interface IAuthenticationRequest {
    username: string;
    password: string;
}
export interface IAuthenticationResponse {
    accessToken: string;
    expiresIn: number;
    roles: IUserRole[];
}

export function logon(credentials: IAuthenticationRequest) {
    return post<IAuthenticationResponse, IAuthenticationResponse>({
        isIesiApi: true,
        needsAuthentication: false,
        url: API_URLS.USER_LOGON,
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            accessToken: data.accessToken,
            expiresIn: data.expiresIn,
            roles: data.roles,
        }),
        body: credentials,
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
