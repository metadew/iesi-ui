import { IState } from 'models/state.models';
import { IAccessLevel, IAccessToken, IRefreshToken, SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { getParentRouteKeys, getRoute, ROUTE_KEYS } from 'views/routes';
import { decode } from 'jsonwebtoken';
import Cookie from 'js-cookie';
import cryptoJS from 'crypto-js';

export const getUserPermissions = (state: IState) => state.auth.permissions;

export const hasRequiredAccessLevels = (
    state: IState,
    requiredAccessLevels: IAccessLevel[] = [],
): boolean => {
    const userPermissions = getUserPermissions(state);
    return requiredAccessLevels.every((requiredAccessLevel) => userPermissions.includes(requiredAccessLevel));
};

export const getAllowedParentRouteKeys = (state: IState): ROUTE_KEYS[] => getParentRouteKeys()
    .filter((routeKey) => hasRequiredAccessLevels(state, getRoute({ routeKey }).requiredAccessLevels));

export const getDecodedAccessToken = (token: string): IAccessToken | null => {
    const decoded: null | { [key: string]: any } = decode(token, { json: true });
    if (decoded !== undefined) {
        return {
            authorities: decoded.authorities,
            username: decoded.user_name,
        };
    }
    return null;
};

export const getDecodedRefreshToken = (token: string): IRefreshToken | null => {
    const decoded: null | { [key: string]: any } = decode(token, { json: true });
    if (decoded !== undefined) {
        return {
            exp: decoded.exp,
        };
    }
    return null;
};

export function checkAuthority(state: IState, privilege: SECURITY_PRIVILEGES) {
    const encryptedCookie = Cookie.get('app_session');

    if (encryptedCookie === undefined) {
        return false;
    }
    const decryptedCookieData = cryptoJS.AES.decrypt(
        encryptedCookie,
        process.env.REACT_APP_COOKIE_SECRET_KEY,
    );
    const decryptedCookie = JSON.parse(decryptedCookieData.toString(cryptoJS.enc.Utf8));

    if (!decryptedCookie.permissions) {
        return false;
    }

    return decryptedCookie.permissions.includes(privilege);
}

export function checkUsername(state: IState, username: string) {
    return state.auth.username === username;
}

export function isAuthenticated(state: IState) {
    return state.auth.accessToken !== undefined && state.auth.accessToken !== '';
}
