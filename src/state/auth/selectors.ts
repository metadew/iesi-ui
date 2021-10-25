import { IState } from 'models/state.models';
import {
    IAccessLevel,
    IAccessToken,
    IPrivilege,
    ITeamSecurityGroup,
    IUser,
    IUserRole,
    SECURITY_PRIVILEGES,
} from 'models/state/auth.models';
import { getParentRouteKeys, getRoute, ROUTE_KEYS } from 'views/routes';
import { decode } from 'jsonwebtoken';

export const getUserPermissions = (state: IState) => state.auth.permissions;
export const getAuth = (state: IState) => state.auth;

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

export const getUserUuidFromToken = (token: string): IAccessToken | null => {
    const decoded: null | { [key: string]: any } = decode(token, { json: true });
    if (decoded !== undefined) {
        return {
            sub: decoded.sub,
            iss: decoded.iss,
            exp: decoded.exp,
            iat: decoded.iat,
            uuid: decoded.uuid,
        };
    }
    return null;
};

export const extractAccessLevelFromUser = (user: IUser): IAccessLevel[] =>
    user.roles
        .map((role: IUserRole) => {
            const { securityGroups } = role.team;
            const { privileges } = role;
            return securityGroups.map((securityGroup: ITeamSecurityGroup) =>
                privileges.map((privilege: IPrivilege) => (
                    {
                        group: securityGroup.name,
                        privilege: SECURITY_PRIVILEGES[privilege.privilege as keyof typeof SECURITY_PRIVILEGES],
                    }
                )))
                .flat();
        }).flat();

export const extractAccessLevelFromUserRoles = (userRoles: IUserRole[]): IAccessLevel[] =>
    userRoles
        .map((role: IUserRole) => {
            const { securityGroups } = role.team;
            const { privileges } = role;
            return securityGroups.map((securityGroup: ITeamSecurityGroup) =>
                privileges.map((privilege: IPrivilege) => (
                    {
                        group: securityGroup.name,
                        privilege: SECURITY_PRIVILEGES[`S_${privilege.privilege}` as keyof typeof SECURITY_PRIVILEGES],
                    }
                )))
                .flat();
        }).flat();

export function checkAuthority(state: IState, privilege: SECURITY_PRIVILEGES, securityGroupName: string) {
    if (securityGroupName == null || privilege == null) {
        return false;
    }
    return state.auth.permissions.some((permission: IAccessLevel) => permission.group === securityGroupName
        && permission.privilege === privilege);
}

export function checkAuthorityGeneral(state: IState, privilege: SECURITY_PRIVILEGES) {
    return state.auth.permissions.some((permission: IAccessLevel) => permission.privilege === privilege);
}

export function isAuthenticated(state: IState) {
    return state.auth.accessToken !== undefined && state.auth.accessToken !== '';
}
