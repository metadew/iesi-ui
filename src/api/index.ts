import * as envConfig from './general/envConfig.api';
import * as auth from './security/security.api';
import * as constants from './constants/constants.api';
import * as environments from './environments/environments.api';
import * as executionRequests from './executionRequests/executionRequests.api';
import * as scriptExecutions from './scriptExecutions/scriptExecutions.api';
import * as scripts from './scripts/scripts.api';
import * as connections from './connections/connections.api';
import * as components from './components/components.api';
import * as openapi from './openapi/openapi.api';
import * as datasets from './datasets/datasets.api';
import * as users from './users/users.api';

export const api = {
    auth,
    envConfig,
    constants,
    environments,
    executionRequests,
    scripts,
    scriptExecutions,
    connections,
    components,
    openapi,
    datasets,
    users,
};
