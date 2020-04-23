import isSet from '@snipsonian/core/es/is/isSet';
import { asyncEntityFetch } from 'snipsonian/observable-state/src/actionableStore/entities/asyncEntityUpdaters';
import { StateChangeNotification } from 'models/state.models';
import { IEnvConfig } from 'models/state/envConfig.models';
import { overrideTranslationsIfAny } from 'views/translations';
import { ROUTE_KEYS } from 'views/routes';
import { triggerFlashMessage } from 'state/ui/actions';
import { getStore } from 'state/index';
import { setIesiApiBaseUrl, setIesiApiTimeoutInSeconds } from 'api/requestWrapper';
import { getAsyncEnvConfig, getTranslationLabelOverrides } from './selectors';
import { createAction } from '../index';

/* eslint-disable no-param-reassign */

export const fetchEnvConfig = () => createAction<{}>({
    type: 'FETCH_ENV_CONFIG',
    payload: {},
    async process({ getState, setStateImmutable, api }) {
        const { dispatch } = getStore();
        try {
            /* for if envConfig already present in browser storage */
            overrideTranslationsIfAny(getTranslationLabelOverrides(getState()));
            let envConfigData = getAsyncEnvConfig(getState()).data;
            if (isSet(envConfigData)) {
                configureIesiApi(envConfigData);
            }

            dispatch(triggerFlashMessage({ translationKey: 'Fetch ENV: start' }));

            setStateImmutable({
                toState: (draftState) => {
                    draftState.envConfig = asyncEntityFetch.triggerWithoutDataReset(draftState.envConfig);
                },
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG],
            });

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
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG, ...i18nNotifications],
            });

            dispatch(triggerFlashMessage({
                translationKey: 'Fetch ENV: success',
                type: 'success',
                navigateToRoute: { routeKey: ROUTE_KEYS.R_REPORTS },
            }));
        } catch (error) {
            setStateImmutable({
                toState: (draftState) => {
                    draftState.envConfig = asyncEntityFetch.failed(draftState.envConfig, error);
                },
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG],
            });
            dispatch(triggerFlashMessage({ translationKey: 'Fetch ENV: error', type: 'error' }));
        }
    },
});

function configureIesiApi(envConfig: IEnvConfig) {
    setIesiApiBaseUrl(envConfig.iesi_api_base_url);
    setIesiApiTimeoutInSeconds(envConfig.iesi_api_timeout_in_seconds);
}
