import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { ICustomAsyncEntity, IState } from 'models/state.models';
import { IEnvConfig } from 'models/state/envConfig.models';
import { II18nState } from 'models/state/i18n.models';
import { DEFAULT_LOCALE } from 'config/i18n.config';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';

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
                components: {
                    filters: null,
                    onlyShowLatestVersion: true,
                    page: 1,
                    sortedColumn: null,
                },
                connections: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                },
                environments: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                },
                executions: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                },
                datasets: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                },
                users: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                },
                teams: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                },
                securityGroups: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                },
                templates: {
                    filters: null,
                    page: 1,
                    sortedColumn: null,
                    onlyShowLatestVersion: true,
                },
            },
        },
        auth: {
            username: 'mocked-test-user',
            permissions: [{
                privilege: SECURITY_PRIVILEGES.S_CONNECTIONS_READ,
            }],
            accessToken: '',
            refreshToken: '',
            expiresAt: new Date(),
        },
        entities: {
            actionTypes: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            connectionTypes: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            componentTypes: {
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
            scriptDetailImport: {
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
            components: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            componentDetail: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            connections: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            connectionDetail: {
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
            environmentDetail: {
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
            datasets: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            datasetDetail: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            datasetDetailExport: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            datasetDetailImport: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            datasetImplementations: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            users: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            userDetail: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            userDetailRole: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            teams: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            teamDetail: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            teamDetailSecurityGroup: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            securityGroups: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            securityGroupDetail: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            templates: {
                data: null,
                fetch: {
                    status: AsyncStatus.Initial,
                    error: null,
                },
            },
            templateDetail: {
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
            iesi_api_client_id: 'iesi-client',
            iesi_api_client_secret: 'iesi',
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
