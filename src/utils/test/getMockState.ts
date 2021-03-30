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
            pollingExecutionRequestIds: [],
            listFilters: {
                scripts: {
                    filters: null,
                    onlyShowLatestVersion: true,
                    page: 1,
                    sortedColumn: null,
                },
                executions: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                },
            },
        },
        auth: {
            username: 'mocked-test-user',
            permissions: {
                edit: true,
                execute: true,
            },
        },
        entities: {
            actionTypes: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            scripts: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            scriptDetail: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            scriptDetailExport: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            executionRequests: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            executionRequestDetail: {
                data: null,
                create: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            scriptExecutionDetail: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            environments: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            openapi: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
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
