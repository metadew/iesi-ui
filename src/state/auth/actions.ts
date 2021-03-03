import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IAccessLevel } from 'models/state/auth.models';
import { getStore } from 'state/index';

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


export const attemptLogon = (username: string, password: string) => createAction<{}>({
    type: 'ATTEMPT_LOGON',
    payload: {
        username,
        password,
    },
    async process({ getState, setStateImmutable, api }) {
        const { dispatch } = getStore();

    },
});
