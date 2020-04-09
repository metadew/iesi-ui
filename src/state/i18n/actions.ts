import { createAction } from 'state';
import { StateChangeNotification } from 'models/state.models';

export const toggleTranslationKeys = () => createAction<{}>({
    type: 'TOGGLE_TRANSLATION_KEYS',
    payload: {},
    process({ setStateImmutable }) {
        setStateImmutable({
            toState: (draftState) => {
                // eslint-disable-next-line no-param-reassign
                draftState.i18n.showTranslationKeys = !draftState.i18n.showTranslationKeys;
            },
            notificationsToTrigger: [StateChangeNotification.I18N_TRANSLATIONS_TOGGLE],
        });
    },
});
