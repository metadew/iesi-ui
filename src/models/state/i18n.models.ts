/* eslint-disable camelcase,@typescript-eslint/camelcase */
export enum Locales {
    en_GB = 'en_GB',
}
/* eslint-enable camelcase,@typescript-eslint/camelcase */

export interface II18nState {
    locale: Locales;
    areTranslationsRefreshed: boolean;
    /**
     * Used in development to show translation ids instead of labels
     */
    showTranslationKeys: boolean;
}
