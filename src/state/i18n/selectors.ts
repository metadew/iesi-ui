import { TTranslator } from '@snipsonian/react/es/components/i18n/translator/types';
import {
    getTranslator as getStoredTranslator,
} from '@snipsonian/react/es/components/i18n/translator/translatorManager';
import { IState } from 'models/state.models';
import { Locales } from 'models/state/i18n.models';

export const getLocale = (state: IState) => state.i18n.locale;

export const areTranslationsRefreshed = (state: IState) => state.i18n.areTranslationsRefreshed;

export const shouldShowTranslationKeys = (state: IState) => state.i18n.showTranslationKeys;

export const getTranslator = (state: IState, localeOverride?: Locales): TTranslator => {
    const locale = localeOverride || getLocale(state);

    return getStoredTranslator({
        locale,
        showTranslationKeys: shouldShowTranslationKeys(state),
        areTranslationsRefreshed: areTranslationsRefreshed(state),
    });
};
