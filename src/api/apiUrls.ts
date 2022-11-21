const API_URLS = {
    /* eslint-disable max-len */

    ENV_CONFIG: '/env-config.json',

    ACTION_TYPES: '/action-types',
    CONNECTION_TYPES: '/connection-types',
    COMPONENT_TYPES: '/component-types',
    ENVIRONMENT_TYPES: '/environment-types',

    ENVIRONMENTS: '/environments',
    ENVIRONMENT_BY_NAME: '/environments/{name}',

    EXECUTION_REQUESTS: '/execution-requests',
    EXECUTION_REQUEST_BY_ID: '/execution-requests/{id}',

    SCRIPTS: '/scripts',
    SCRIPTS_IMPORT: '/scripts/import',
    SCRIPT_BY_NAME: '/scripts/{name}',
    SCRIPT_BY_NAME_VERSION: '/scripts/{name}/{version}',
    SCRIPT_BY_NAME_VERSION_DOWNLOAD: '/scripts/{name}/{version}/download',

    SCRIPT_EXECUTION_BY_RUN_AND_PROCESS_ID: '/script-executions/{runId}/{processId}',

    CONNECTIONS: '/connections',
    CONNECTION_BY_NAME: '/connections/{name}',

    COMPONENTS: '/components',
    COMPONENT_IMPORT: '/components/import',
    COMPONENT_BY_NAME: '/components/{name}',
    COMPONENT_BY_NAME_VERSION: '/components/{name}/{version}',
    COMPONENT_BY_NAME_VERSION_DOWNLOAD: '/components/{name}/{version}/download',

    USERS: '/users',
    USER_BY_NAME: '/users/{name}',
    USER_BY_ID: '/users/{id}',
    USER_BY_ID_PASSWORD: '/users/{id}/password',
    USER_LOGON: '/oauth/token',
    USER_CREATE: '/users/create',
    USER_CHECK_TOKEN: '/oauth/check_token',

    TEAMS: '/teams',
    TEAMS_NAMES: '/teams/names',
    TEAM_BY_NAME: '/teams/{name}',
    TEAM_BY_ID: '/teams/{id}',
    TEAM_BY_ID_AND_ROLE_ID: '/teams/{id}/roles/{roleId}/users',
    TEAM_BY_ID_AND_ROLE_ID_AND_USER_ID: '/teams/{id}/roles/{roleId}/users/{userId}',

    SECURITY_GROUPS: '/security-groups',
    SECURITY_GROUPS_BY_NAME: '/security-groups/{name}',
    SECURITY_GROUPS_BY_ID: '/security-groups/{id}',
    SECURITY_GROUPS_BY_ID_AND_TEAM_ID: '/security-groups/{id}/teams/{team-uuid}',

    OPEN_API_TRANSFORM: '/openapi/transform',

    DATASETS: '/datasets',
    DATASETS_IMPORT: '/datasets/import',
    DATASET_BY_NAME: '/datasets/{name}',
    DATASET_BY_NAME_DOWNLOAD: '/datasets/{name}/download',
    DATASET_BY_UUID: '/datasets/{uuid}',
    DATASET_IMPLEMENTATIONS: '/datasets/{uuid}/implementations',

    TEMPLATES: '/templates',
    TEMPLATE_BY_NAME_AND_VERSION: '/templates/{name}/{version}',
    TEMPLATE_BY_ID: '/templates/{id}',

    /* eslint-enable max-len */
};

export default API_URLS;
