import { asyncEntityFetch } from 'snipsonian/observable-state/src/actionableStore/entities/asyncEntityUpdaters';
import { StateChangeNotification } from 'models/state.models';
import { overrideTranslationsIfAny } from 'views/translations';
import { triggerFlashMessage } from 'state/ui/actions';
import { getStore } from 'state/index';
import { getTranslationLabelOverrides } from './selectors';
import { createAction } from '../index';
import ROUTE_KEYS from '../../routeKeys';

// TODO reduce the boilerplate with an 'entities' mechanism?
// (or is this the exception because we keep it out of the 'entities' state part?)

/* eslint-disable no-param-reassign */

export const fetchEnvConfig = () => createAction<{}>({
    type: 'FETCH_ENV_CONFIG',
    payload: {},
    async process({ getState, setStateImmutable, api }) {
        const { dispatch } = getStore();
        try {
            dispatch(triggerFlashMessage({ translationKey: 'Fetch ENV: start' }));

            /* for if they were stored in browser storage */
            overrideTranslationsIfAny(getTranslationLabelOverrides(getState()));

            setStateImmutable({
                toState: (draftState) => {
                    draftState.envConfig = asyncEntityFetch.triggerWithoutDataReset(draftState.envConfig);
                },
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG],
            });

            const envConfigData = await api.envConfig.fetchEnvironmentConfig();

            const didOverride = overrideTranslationsIfAny(envConfigData.translation_label_overrides);
            const i18nNotifications = didOverride
                ? [StateChangeNotification.I18N_TRANSLATIONS_REFRESHED]
                : [];

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
                navigateToRoute: { routeKey: ROUTE_KEYS.R_REPORT },
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
