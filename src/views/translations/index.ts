import flatten from 'flat';
import produce from 'immer';
import { ITranslationsPerLocale } from '@snipsonian/react/es/components/i18n/translations/types';
import { Locales } from 'models/i18n.models';
import translationsEnGB from './en_GB.yml';

const shippedTranslations: ITranslationsPerLocale = {
    [Locales.en_GB]: flatten(translationsEnGB),
};

let allTranslations: ITranslationsPerLocale = shippedTranslations;

export function getTranslations() {
    return allTranslations;
}

export function overrideTranslationsIfAny(overriddenTranslations: ITranslationsPerLocale) {
    if (overriddenTranslations) {
        allTranslations = produce(shippedTranslations, (draftTranslations) => {
            Object.keys(overriddenTranslations)
                .forEach((locale) => {
                    const overriddenTranslationsOfLocale = overriddenTranslations[locale];

                    if (overriddenTranslationsOfLocale) {
                        Object.keys(overriddenTranslationsOfLocale)
                            .forEach((translationKey) => {
                                // eslint-disable-next-line no-param-reassign,max-len
                                draftTranslations[locale][translationKey] = overriddenTranslationsOfLocale[translationKey];
                            });
                    }
                });
        });
    }
}
