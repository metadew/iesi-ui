import { IState } from 'models/state.models';
import { IAccessLevel } from 'models/state/auth.models';
import { getParentRouteKeys, getRoute, ROUTE_KEYS } from 'views/routes';

export const getUserPermissions = (state: IState) => state.auth.permissions;

export const hasRequiredAccessLevels = (
    state: IState,
    requiredAccessLevels: Partial<IAccessLevel> = {},
): boolean => {
    const userPermissions = getUserPermissions(state);
    const missingAccessLevels = Object.keys(requiredAccessLevels)
        .filter((requiredAccessLevelKey) => {
            const accessLevel = requiredAccessLevels[requiredAccessLevelKey as keyof IAccessLevel];
            return !!accessLevel && !userPermissions[requiredAccessLevelKey as keyof IAccessLevel];
        });
    return missingAccessLevels.length === 0;
};

export const getAllowedParentRouteKeys = (state: IState): ROUTE_KEYS[] => getParentRouteKeys()
    .filter((routeKey) => hasRequiredAccessLevels(state, getRoute({ routeKey }).requiredAccessLevels));
