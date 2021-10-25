import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IAuthenticationResponse } from 'api/security/security.api';
import { IAccessToken } from 'models/state/auth.models';
import { extractAccessLevelFromUserRoles, getUserUuidFromToken } from './selectors';

export const triggerLogon = (payload: IAuthenticationResponse) => createAction<IAuthenticationResponse>({
    type: 'LOGON',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                const accessToken: IAccessToken = getUserUuidFromToken(action.payload.accessToken);
                sessionStorage.setItem('token', action.payload.accessToken);
                // eslint-disable-next-line no-param-reassign
                draftState.auth.accessToken = action.payload.accessToken;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.username = accessToken.sub;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.permissions = extractAccessLevelFromUserRoles(action.payload.roles);
            },
            notificationsToTrigger: [StateChangeNotification.AUTH],
        });
    },
});
