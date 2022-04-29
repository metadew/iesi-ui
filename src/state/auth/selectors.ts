import { IState } from 'models/state.models';
import { IAccessLevel, IAccessToken, SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { getParentRouteKeys, getRoute, ROUTE_KEYS } from 'views/routes';
import { decode } from 'jsonwebtoken';

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

export const getDecodedToken = (token: string): IAccessToken | null => {
    const decoded: null | { [key: string]: any } = decode(token, { json: true });
    if (decoded !== undefined) {
        return {
            authorities: decoded.authorities,
        };
    }
    return null;
};

export function checkAuthority(state: IState, privilege: SECURITY_PRIVILEGES) {
    return state.auth.permissions.some((permission: IAccessLevel) => permission.privilege === privilege);
}

export function isAuthenticated(state: IState) {
    return state.auth.accessToken !== undefined && state.auth.accessToken !== '';
}
