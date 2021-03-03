import { post } from '../requestWrapper';
import API_URLS from '../apiUrls';
import { IAuthenticationRequest, IAuthenticationResponse } from 'models/state/auth.models';

export function logon(credentials: IAuthenticationRequest) {
    return post<IAuthenticationResponse, IAuthenticationResponse>({
        isIesiApi: true,
        needsAuthentication: false,
        url: API_URLS.SECURITY_LOGON,
        mapResponse: ({ data }) => ({
            accessToken: data.accessToken,
            expiresIn: data.expiresIn,
        }),
        body: credentials,
    });
}
