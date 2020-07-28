import * as envConfig from './general/envConfig.api';
import * as constants from './constants/constants.api';
import * as environments from './environments/environments.api';
import * as executionRequests from './executionRequests/executionRequests.api';
import * as scriptExecutions from './scriptExecutions/scriptExecutions.api';
import * as scriptResults from './scriptResults/scriptResults.api';
import * as scripts from './scripts/scripts.api';

export const api = {
    envConfig,
    constants,
    environments,
    executionRequests,
    scripts,
    scriptExecutions,
    scriptResults,
};
