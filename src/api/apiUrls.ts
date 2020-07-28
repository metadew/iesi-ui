const API_URLS = {
    /* eslint-disable max-len */

    ENV_CONFIG: '/env-config.json',

    ACTION_TYPES: '/action_types',
    CONNECTION_TYPES: '/connection-types',

    ENVIRONMENTS: '/environments',
    ENVIRONMENT_BY_NAME: '/environments/{name}',

    EXECUTION_REQUESTS: '/execution_requests',
    EXECUTION_REQUEST_BY_ID: '/execution_requests/{id}',

    SCRIPTS: '/scripts',
    SCRIPT_BY_NAME: '/scripts/{name}',
    SCRIPT_BY_NAME_VERSION: '/scripts/{name}/{version}',

    SCRIPT_EXECUTION: '/script_executions/{run_id}/{prc_id}',

    SCRIPT_RESULTS: '/scriptResults',
    SCRIPT_RESULTS_BY_RUN_ID: '/scriptResults/{runId}',
    SCRIPT_RESULT_BY_RUN_AND_PROCESS_ID: '/scriptResults/{runId}/{processId}',

    /* eslint-enable max-len */
};

export default API_URLS;
