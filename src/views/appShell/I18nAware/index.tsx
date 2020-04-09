import React, { ReactNode } from 'react';
import I18nContext from '@snipsonian/react/es/components/i18n/I18nContext';
import { SHOW_MSG_KEY_TRANSLATOR } from '@snipsonian/react/es/components/i18n/translator/translatorManager';
import { StateChangeNotification } from 'models/state.models';
import { DEFAULT_LOCALE } from 'config/i18n.config';
import { getLocale, getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';

interface IPublicProps {
    children: ReactNode;
}

function I18nAware({
    state,
    children,
}: IObserveProps & IPublicProps) {
    const locale = getLocale(state) || DEFAULT_LOCALE;
    const translator = getTranslator(state) || SHOW_MSG_KEY_TRANSLATOR;

    return (
        <I18nContext.Provider value={{ translator, locale }}>
            {children}
        </I18nContext.Provider>
    );
}

export default observe<IPublicProps>(
    [StateChangeNotification.I18N_TRANSLATIONS],
    I18nAware,
);
