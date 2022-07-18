import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IAuthenticationResponse } from 'api/security/security.api';
import { IAccessToken } from 'models/state/auth.models';
import { ONE_MINUTE_IN_MILLIS, ONE_SECOND_IN_MILLIS } from '@snipsonian/core/es/time/periodsInMillis';
import { getDecodedToken } from './selectors';

export const triggerLogon = (payload: IAuthenticationResponse) => createAction<IAuthenticationResponse>({
    type: 'LOGON',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                const accessToken: IAccessToken = getDecodedToken(action.payload.access_token);
                const currentTime = new Date().getTime();
                // eslint-disable-next-line no-param-reassign
                draftState.auth.accessToken = action.payload.access_token;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.refreshToken = action.payload.refresh_token;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.expiresAt = new Date(currentTime + ONE_SECOND_IN_MILLIS * action.payload.expires_in);
                // eslint-disable-next-line no-param-reassign
                draftState.auth.permissions = accessToken.authorities.map((authority) => ({ privilege: authority }));
                // eslint-disable-next-line no-param-reassign
                draftState.auth.username = accessToken.username;
            },
            notificationsToTrigger: [StateChangeNotification.AUTH],
        });
    },
});

export const checkAccessTokenExpiration = () => createAction<{}>({
    type: 'CHECK_ACCESS_TOKEN_EXPIRATION',
    payload: {},
    async process({ getState, api, dispatch }) {
        const state = getState();
        const { expiresAt, refreshToken } = state.auth;

        if (refreshToken.length > 0) {
            // Refresh the token 5 minutes before the expiration
            const beforeExpireInSecond = new Date(new Date(expiresAt).getTime() - ONE_MINUTE_IN_MILLIS * 5);
            const currentTime = new Date();

            if (currentTime >= beforeExpireInSecond) {
                const response = await api.auth.refreshToken(refreshToken);
                dispatch(triggerLogon(response));
            }
        }
    },
});
