import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IAuthenticationResponse } from 'api/security/security.api';
import { getAuthoritiesFromToken } from 'state/auth/selectors';

export const triggerLogon = (payload: IAuthenticationResponse) => createAction<IAuthenticationResponse>({
    type: 'LOGON',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.auth.accessToken = action.payload.access_token;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.permissions = getAuthoritiesFromToken(action.payload.access_token);
            },
            notificationsToTrigger: [StateChangeNotification.AUTH],
        });
    },
});
