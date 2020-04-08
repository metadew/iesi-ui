import flatten from 'flat';
import produce from 'immer';
import { ITranslationsPerLocale } from '@snipsonian/react/es/components/i18n/translations/types';
import createTranslationsManager from '@snipsonian/react/es/components/i18n/translations/createTranslationsManager';
import generateTranslatorForEachSupportedLocale
    from '@snipsonian/react/es/components/i18n/translator/generateTranslatorForEachSupportedLocale';
import { Locales } from 'models/state/i18n.models';
import { LOCALES } from 'config/i18n.config';
import translationsEnGB from './en_GB.yml';

const shippedTranslations: ITranslationsPerLocale = {
    [Locales.en_GB]: flatten(translationsEnGB),
};

export const translationsManager = createTranslationsManager({
    locales: LOCALES,
    initialTranslations: shippedTranslations,
});

generateTranslatorForEachSupportedLocale({
    translationsManager,
});

export function overrideTranslationsIfAny(overriddenTranslations: ITranslationsPerLocale): boolean {
    let didOverride = false;

    if (overriddenTranslations) {
        Object.keys(overriddenTranslations)
            .filter((locale) => LOCALES.indexOf(locale) > -1)
            .forEach((locale) => {
                const overriddenTranslationsOfLocale = overriddenTranslations[locale];

                if (overriddenTranslationsOfLocale) {
                    translationsManager.setTranslationsOfLocale({
                        locale,
                        translations: produce(
                            translationsManager.getTranslationsOfLocale({ locale }),
                            (draftTranslationsOfLocale) => {
                                Object.keys(overriddenTranslationsOfLocale)
                                    .forEach((translationKey) => {
                                        // eslint-disable-next-line no-param-reassign,max-len
                                        draftTranslationsOfLocale[translationKey] = overriddenTranslationsOfLocale[translationKey];
                                    });
                            },
                        ),
                    });

                    didOverride = true;
                }
            });
    }

    return didOverride;
}
