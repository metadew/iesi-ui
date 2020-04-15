import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { ICustomAsyncEntity, IState } from 'models/state.models';
import { IEnvConfig } from 'models/state/envConfig.models';
import { II18nState } from 'models/state/i18n.models';
import { DEFAULT_LOCALE } from 'config/i18n.config';

export default function getMockState({
    envConfig = getDefaultEnvConfig(),
    i18n: {
        locale = DEFAULT_LOCALE,
        areTranslationsRefreshed = true,
        showTranslationKeys = false,
    } = {},
}: {
    envConfig?: ICustomAsyncEntity<IEnvConfig>;
    i18n?: Partial<II18nState>;
} = {}): IState {
    return {
        envConfig,
        i18n: {
            locale,
            areTranslationsRefreshed,
            showTranslationKeys,
        },
        ui: {
            flashMessages: [],
        },
        auth: {
            username: 'mocked-test-user',
            permissions: {
                edit: true,
                execute: true,
            },
        },
    };
}

function getDefaultEnvConfig(): ICustomAsyncEntity<IEnvConfig> {
    return {
        data: {
            iesi_api_base_url: 'https://some.iesi-api.be',
            iesi_api_timeout_in_seconds: 1,
            translation_label_overrides: {
                en_GB: {},
            },
        },
        fetch: {
            status: AsyncStatus.Success,
            error: null,
        },
    };
}
