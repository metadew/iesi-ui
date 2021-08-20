import { IState } from 'models/state.models';
import { IAccessLevel, IAuthState, SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { getParentRouteKeys, getRoute, ROUTE_KEYS } from 'views/routes';

export const getUserPermissions = (state: IState) => state.auth.permissions;
export const getAuth = (state: IState) => state.auth ;

export const hasRequiredAccessLevels = (
    state: IState,
    requiredAccessLevels: IAccessLevel[] = [],
): boolean => {
    const userPermissions = getUserPermissions(state);
    return requiredAccessLevels.every((requiredAccessLevel) => userPermissions.includes(requiredAccessLevel));
    // const missingAccessLevels = Object.keys(requiredAccessLevels)
    //     .filter((requiredAccessLevelKey) => {
    //         const accessLevel = requiredAccessLevels[requiredAccessLevelKey as keyof IAccessLevel];
    //         return !!accessLevel && !userPermissions[requiredAccessLevelKey as keyof IAccessLevel];
    //     });
    // return missingAccessLevels.length === 0;
};

export const hasConceptAccessLevels = (
    state: IState,
    requiredAccessLevels: IAccessLevel[] = [],
): boolean => {
    const userPermissions = getUserPermissions(state);
    return requiredAccessLevels.every((requiredAccessLevel) => userPermissions.includes(requiredAccessLevel));
    // const missingAccessLevels = Object.keys(requiredAccessLevels)
    //     .filter((requiredAccessLevelKey) => {
    //         const accessLevel = requiredAccessLevels[requiredAccessLevelKey as keyof IAccessLevel];
    //         return !!accessLevel && !userPermissions[requiredAccessLevelKey as keyof IAccessLevel];
    //     });
    // return missingAccessLevels.length === 0;
};

export const getAllowedParentRouteKeys = (state: IState): ROUTE_KEYS[] => getParentRouteKeys()
    .filter((routeKey) => hasRequiredAccessLevels(state, getRoute({ routeKey }).requiredAccessLevels));

    // TODO: move to hasrequired
export function checkAuthority(privilege: SECURITY_PRIVILEGES, securityGroupName: string) {
    if (securityGroupName == null || privilege == null) {
        return false;
    }
    return JSON.parse(sessionStorage.getItem('authorities')).includes(`${privilege}@${securityGroupName}`);
}

export function checkAuthorityGeneral(privilege: SECURITY_PRIVILEGES) {
    return JSON.parse(sessionStorage.getItem('authorities'))
        .map((value: string) => value.substr(0, value.indexOf('@'))).includes(privilege);
}

export const getAsyncUserDetail = (state: IState) => state.auth.;
