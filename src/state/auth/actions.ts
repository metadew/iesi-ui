import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IAccessLevel } from 'models/router.models';

export const updateUserPermission = ({ permission }: { permission: keyof IAccessLevel }) => createAction<{}>({
    type: 'UPDATE_USER_PERMISSION',
    payload: {
        permission,
    },
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.auth.permissions[permission] = !draftState.auth.permissions[permission];
            },
            notificationsToTrigger: [StateChangeNotification.AUTH],
        });
    },
});
