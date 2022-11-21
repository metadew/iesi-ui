/**
 * Keep in sync with DEFAULT_ENV_CONFIG_CONTENT !!!
 */

import { ITranslationsPerLocale } from '@snipsonian/react/es/components/i18n/translations/types';
import { ICustomAsyncEntity } from './entities.models';

export type TEnvConfigState = ICustomAsyncEntity<IEnvConfig>;

export interface IEnvConfig {
    /* eslint-disable camelcase */
    iesi_api_base_url: string;
    iesi_api_timeout_in_seconds: number;
    iesi_api_client_id: string;
    iesi_api_client_secret: string;
    translation_label_overrides: ITranslationsPerLocale;
    /* eslint-enable camelcase */
}
