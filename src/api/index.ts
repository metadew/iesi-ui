import * as envConfig from './general/envConfig.api';
import * as constants from './constants/constants.api';
import * as environments from './environments/environments.api';
import * as executionRequests from './executionRequests/executionRequests.api';
import * as scriptExecutions from './scriptExecutions/scriptExecutions.api';
import * as scripts from './scripts/scripts.api';
import * as security from './security/security.api';
import * as connections from './connections/connections.api';
import * as components from './components/components.api';
import * as openapi from './openapi/openapi.api';

export const api = {
    envConfig,
    constants,
    environments,
    executionRequests,
    scripts,
    scriptExecutions,
    security,
    connections,
    components,
    openapi,
};
