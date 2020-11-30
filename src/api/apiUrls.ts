const API_URLS = {
    /* eslint-disable max-len */

    ENV_CONFIG: '/env-config.json',

    ACTION_TYPES: '/action-types',
    CONNECTION_TYPES: '/connection-types',

    ENVIRONMENTS: '/environments',
    ENVIRONMENT_BY_NAME: '/environments/{name}',

    EXECUTION_REQUESTS: '/execution-requests',
    EXECUTION_REQUEST_BY_ID: '/execution-requests/{id}',

    SCRIPTS: '/scripts',
    SCRIPT_BY_NAME: '/scripts/{name}',
    SCRIPT_BY_NAME_VERSION: '/scripts/{name}/{version}',
    SCRIPT_BY_NAME_VERSION_DOWNLOAD: '/scripts/{name}/{version}/download',

    SCRIPT_EXECUTION_BY_RUN_AND_PROCESS_ID: '/script-executions/{runId}/{processId}',

    /* eslint-enable max-len */
};

export default API_URLS;
