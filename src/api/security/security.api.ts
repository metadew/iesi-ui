import { post } from '../requestWrapper';
import API_URLS from '../apiUrls';

interface IAuthenticationRequest {
    username: string;
    password: string;
}
interface IAuthenticationResponse {
    accessToken: string;
    expiresIn: number;
}

export function logon(credentials: IAuthenticationRequest) {
    return post<IAuthenticationResponse, IAuthenticationResponse>({
        isIesiApi: true,
        needsAuthentication: false,
        url: API_URLS.SECURITY_LOGON,
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            accessToken: data.accessToken,
            expiresIn: data.expiresIn,
        }),
        body: credentials,
    });
}
