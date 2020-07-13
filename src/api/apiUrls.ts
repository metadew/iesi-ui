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

    /* eslint-enable max-len */
};

export default API_URLS;
