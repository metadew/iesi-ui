import { get, post } from '../requestWrapper';
import API_URLS from '../apiUrls';
import { IAuthenticationRequest, IAuthenticationResponse, IUser, IUserByIdPayload } from 'models/state/auth.models';

export function logon(credentials: IAuthenticationRequest) {
    return post<IAuthenticationResponse, IAuthenticationResponse>({
        isIesiApi: true,
        needsAuthentication: false,
        url: API_URLS.USER_LOGON,
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            accessToken: data.accessToken,
            expiresIn: data.expiresIn,
        }),
        body: credentials,
    });
}


export function fetchUserByUuid({ uuid }: IUserByIdPayload) {
    return get<IUser>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.USER_BY_UUID,
        pathParams: {
            uuid,
        },
        // eslint-disable-next-line no-underscore-dangle
        mapResponse: ({ data }) => data,
    });
}