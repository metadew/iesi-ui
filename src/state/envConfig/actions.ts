import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { StateChangeNotification } from 'models/state.models';
import { overrideTranslationsIfAny } from 'views/translations';
import { triggerFlashMessage } from 'state/ui/actions';
import { getStore } from 'state/index';
import { getTranslationLabelOverrides } from './selectors';
import { createAction } from '../index';

// TODO reduce the boilerplate with an 'entities' mechanism?
// (or is this the exception because we keep it out of the 'entities' state part?)

/* eslint-disable no-param-reassign */

export const fetchEnvConfig = () => createAction<{}>({
    type: 'FETCH_ENV_CONFIG',
    payload: {},
    async process({ getState, setStateImmutable, api }) {
        const { dispatch } = getStore();
        try {
            dispatch(triggerFlashMessage({ msg: 'Fetch ENV: start' }));
            dispatch(triggerFlashMessage({ msg: 'Fetch ENV: start 2' }));

            /* for if they were stored in browser storage */
            overrideTranslationsIfAny(getTranslationLabelOverrides(getState()));

            setStateImmutable({
                toState: (draftState) => {
                    draftState.envConfig.fetch.status = AsyncStatus.Busy;
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
                    draftState.envConfig.fetch.status = AsyncStatus.Success;
                    draftState.envConfig.data = envConfigData;

                    draftState.i18n.areTranslationsRefreshed = true;
                },
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG, ...i18nNotifications],
            });
            dispatch(triggerFlashMessage({ msg: 'Fetch ENV: success', options: { variant: 'success' } }));
            dispatch(triggerFlashMessage({ msg: 'Fetch ENV: success 2', options: { variant: 'success' } }));
        } catch (error) {
            setStateImmutable({
                toState: (draftState) => {
                    draftState.envConfig.fetch.status = AsyncStatus.Error;
                    draftState.envConfig.fetch.error = error;
                },
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG],
            });
            dispatch(triggerFlashMessage({ msg: 'Fetch ENV: error', options: { variant: 'error' } }));
        }
    },
});
