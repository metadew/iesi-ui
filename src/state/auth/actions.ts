import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IAuthenticationResponse } from 'api/security/security.api';
import { IAccessToken } from 'models/state/auth.models';
import { getDecodedToken } from './selectors';

export const triggerLogon = (payload: IAuthenticationResponse) => createAction<IAuthenticationResponse>({
    type: 'LOGON',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                const accessToken: IAccessToken = getDecodedToken(action.payload.access_token);
                // eslint-disable-next-line no-param-reassign
                draftState.auth.accessToken = action.payload.access_token;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.refreshToken = action.payload.refresh_token;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.permissions = accessToken.authorities.map((authority) => ({ privilege: authority }));
            },
            notificationsToTrigger: [StateChangeNotification.AUTH],
        });
    },
});

export const triggerRfresh = (payload: IAuthenticationResponse) => createAction<IAuthenticationResponse>({
    type: 'REFRESH',
    payload,
    process({ setStateImmutable, action }) {
        setStateImmutable({
            toState: (draftState) => {
                const accessToken: IAccessToken = getDecodedToken(action.payload.access_token);
                // eslint-disable-next-line no-param-reassign
                draftState.auth.accessToken = action.payload.access_token;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.refreshToken = action.payload.refresh_token;
                // eslint-disable-next-line no-param-reassign
                draftState.auth.permissions = accessToken.authorities.map((authority) => ({ privilege: authority }));
                console.log('UPDATED ACCESS TOKEN : ', action.payload.access_token);
            },
            notificationsToTrigger: [],
        });
    },
});
