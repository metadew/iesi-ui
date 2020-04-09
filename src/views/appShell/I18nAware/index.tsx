import React, { ReactNode } from 'react';
import { TTranslator } from '@snipsonian/react/es/components/i18n/translator/types';
import I18nContext from '@snipsonian/react/es/components/i18n/I18nContext';
import { SHOW_MSG_KEY_TRANSLATOR } from '@snipsonian/react/es/components/i18n/translator/translatorManager';
import { StateChangeNotification } from 'models/state.models';
import { Locales } from 'models/state/i18n.models';
import { DEFAULT_LOCALE } from 'config/i18n.config';
import { getLocale, getTranslator } from 'state/i18n/selectors';
import { observeXL } from 'views/observe';

interface IPublicProps {
    children: ReactNode;
}

interface IPrivateProps {
    locale: Locales;
    translator: TTranslator;
}

function I18nAware({
    translator = SHOW_MSG_KEY_TRANSLATOR,
    locale = DEFAULT_LOCALE,
    children,
}: IPrivateProps & IPublicProps) {
    return (
        <I18nContext.Provider value={{ translator, locale }}>
            {children}
        </I18nContext.Provider>
    );
}

export default observeXL<IPrivateProps, IPublicProps>(
    {
        notifications: [StateChangeNotification.I18N_TRANSLATIONS],
        select: ({ state }) => ({
            locale: getLocale(state),
            translator: getTranslator(state),
        }),
    },
    I18nAware,
);
