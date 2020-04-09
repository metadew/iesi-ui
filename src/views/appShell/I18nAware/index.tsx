import React from 'react';
import I18nContext from '@snipsonian/react/es/components/i18n/I18nContext';
import { SHOW_MSG_KEY_TRANSLATOR } from '@snipsonian/react/es/components/i18n/translator/translatorManager';
import { StateChangeNotification } from 'models/state.models';
import { DEFAULT_LOCALE } from 'config/i18n.config';
import { getLocale, getTranslator } from 'state/i18n/selectors';
import { observe, IObserveProps, IPublicPropsWithChildren } from 'views/observe';

function I18nAware({
    state,
    children,
}: IObserveProps & IPublicPropsWithChildren) {
    const locale = getLocale(state) || DEFAULT_LOCALE;
    const translator = getTranslator(state) || SHOW_MSG_KEY_TRANSLATOR;

    return (
        <I18nContext.Provider value={{ translator, locale }}>
            {children}
        </I18nContext.Provider>
    );
}

export default observe<IPublicPropsWithChildren>(
    [StateChangeNotification.I18N_TRANSLATIONS],
    I18nAware,
);
