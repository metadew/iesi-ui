import { IState } from 'models/state.models';
import { IAccessLevel } from 'models/state/auth.models';

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
