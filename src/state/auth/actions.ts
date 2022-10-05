import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IAuthenticationResponse } from 'api/security/security.api';
import { IAccessToken, IRefreshToken } from 'models/state/auth.models';
import { ONE_MINUTE_IN_MILLIS, ONE_SECOND_IN_MILLIS } from '@snipsonian/core/es/time/periodsInMillis';
import cryptoJS from 'crypto-js';
import Cookie from 'js-cookie';
import { getDecodedAccessToken, getDecodedRefreshToken } from './selectors';
import 'dotenv/config';

export const triggerLogon = (payload: IAuthenticationResponse) => createAction<IAuthenticationResponse>({
    type: 'LOGON',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                const accessToken: IAccessToken = getDecodedAccessToken(action.payload.access_token);
                const refreshToken: IRefreshToken = getDecodedRefreshToken(action.payload.refresh_token);
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

                const encryptedCookie = cryptoJS.AES.encrypt(JSON.stringify({
                    access_token: draftState.auth.accessToken,
                    refresh_token: draftState.auth.refreshToken,
                    permissions: draftState.auth.permissions.map((privilege) => privilege.privilege),
                }), process.env.REACT_APP_COOKIE_SECRET_KEY).toString();

                Cookie.remove('app_session');
                Cookie.set('app_session', encryptedCookie, {
                    expires: new Date(refreshToken.exp * 1000),
                    secure: true,
                    sameSite: 'strict',
                });
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
