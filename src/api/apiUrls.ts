const API_URLS = {
    /* eslint-disable max-len */

    ENV_CONFIG: '/env-config.json',

    ACTION_TYPES: '/action-types',
    CONNECTION_TYPES: '/connection-types',
    COMPONENT_TYPES: '/component-types',

    ENVIRONMENTS: '/environments',
    ENVIRONMENTS_LIST: '/environments/list',
    ENVIRONMENT_BY_NAME: '/environments/{name}',

    EXECUTION_REQUESTS: '/execution-requests',
    EXECUTION_REQUEST_BY_ID: '/execution-requests/{id}',

    SCRIPTS: '/scripts',
    SCRIPT_BY_NAME: '/scripts/{name}',
    SCRIPT_BY_NAME_VERSION: '/scripts/{name}/{version}',
    SCRIPT_BY_NAME_VERSION_DOWNLOAD: '/scripts/{name}/{version}/download',

    SCRIPT_EXECUTION_BY_RUN_AND_PROCESS_ID: '/script-executions/{runId}/{processId}',

    CONNECTIONS: '/connections',
    CONNECTION_BY_NAME: '/connections/{name}',

    COMPONENTS: '/components',
    COMPONENT_BY_NAME: '/components/{name}',
    COMPONENT_BY_NAME_VERSION: '/components/{name}/{version}',

    SECURITY_LOGON: '/users/login',

    OPEN_API_TRANSFORM: '/openapi/transform',

    /* eslint-enable max-len */
};

export default API_URLS;
