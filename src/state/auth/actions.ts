import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';
import { IAccessLevel, IAuthenticationRequest } from 'models/state/auth.models';

export const updateUserPermission = ({ permission }: { permission: IAccessLevel }) => createAction<{}>({
    type: 'UPDATE_USER_PERMISSION',
    payload: {
        permission,
    },
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                // TODO: 
                draftState.auth.permissions[permission] = !draftState.auth.permissions[permission];
            },
            notificationsToTrigger: [StateChangeNotification.AUTH],
        });
    },
});

import isSet from '@snipsonian/core/es/is/isSet';
import { asyncEntityFetch } from 'snipsonian/observable-state/src/actionableStore/entities/asyncEntityUpdaters';
import { IEnvConfig } from 'models/state/envConfig.models';
import { overrideTranslationsIfAny } from 'views/translations';
import { triggerFlashMessage } from 'state/ui/actions';
import { getStore } from 'state/index';
import { setIesiApiBaseUrl, setIesiApiTimeoutInSeconds } from 'api/requestWrapper';
import { getAuth } from './selectors';

/* eslint-disable no-param-reassign */

export const fetchEnvConfig = () => createAction<{}>({
    type: 'FETCH_ENV_CONFIG',
    payload: {},
    async process({ getState, setStateImmutable, api }) {
        // const { dispatch } = getStore();
        try {
            /* for if envConfig already present in browser storage */
            overrideTranslationsIfAny(getTranslationLabelOverrides(getState()));
            let auth = getAuth(getState());
            // if (isSet(auth)) {
            //     configureIesiApi(auth);
            // }

            // setStateImmutable({
            //     toState: (draftState) => {
            //         draftState.auth = asyncEntityFetch.triggerWithoutDataReset(draftState.auth);
            //     },
            //     notificationsToTrigger: [StateChangeNotification.AUTH],
            // });

            envConfigData = await api.envConfig.fetchEnvironmentConfig();

            const didOverride = overrideTranslationsIfAny(envConfigData.translation_label_overrides);
            const i18nNotifications = didOverride
                ? [StateChangeNotification.I18N_TRANSLATIONS_REFRESHED]
                : [];

            configureIesiApi(envConfigData);

            setStateImmutable({
                toState: (draftState) => {
                    draftState.envConfig = asyncEntityFetch.succeeded(draftState.envConfig, envConfigData);

                    draftState.i18n.areTranslationsRefreshed = true;
                },
                notificationsToTrigger: [StateChangeNotification.AUTH, ...i18nNotifications],
            });
        } catch (error) {
            setStateImmutable({
                toState: (draftState) => {
                    draftState.envConfig = asyncEntityFetch.failed(draftState.envConfig, error);
                },
                notificationsToTrigger: [StateChangeNotification.AUTH],
            });
            // dispatch(triggerFlashMessage({ translationKey: 'error.fetch_env', type: 'error' }));
        }
    },
});

function configureIesiApi(envConfig: IEnvConfig) {
    setIesiApiBaseUrl(envConfig.iesi_api_base_url);
    setIesiApiTimeoutInSeconds(envConfig.iesi_api_timeout_in_seconds);
}


export const logonUserPermission = ({ authenticationRequest }: { authenticationRequest: IAuthenticationRequest }) => createAction<{}>({
    type: 'LOGON_USER',
    payload: {
        permission,
    },
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                // TODO: 
                draftState.auth.permissions[permission] = !draftState.auth.permissions[permission];
            },
            notificationsToTrigger: [StateChangeNotification.AUTH],
        });
    },
});
