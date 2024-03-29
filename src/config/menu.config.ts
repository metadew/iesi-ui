import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { ROUTE_KEYS } from 'views/routes';
import { getDecodedToken } from 'utils/users/userUtils';

const TRANSLATION_PREFIX = 'app_shell.header.menu';

export interface IMenuItem {
    routeKey: ROUTE_KEYS;
    queryParams?: {
        [key: string]: string;
    };
    translationKey: string;
    securityPrivilege: SECURITY_PRIVILEGES;
}

export const MAIN_NAV_ITEMS: IMenuItem[] = [
    toMenuItem({
        routeKey: ROUTE_KEYS.R_SCRIPTS,
        translationKeySuffix: 'scripts',
        securityPrivilege: SECURITY_PRIVILEGES.S_SCRIPTS_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_REPORTS,
        queryParams: {
            requester: getDecodedToken().username,
        },
        translationKeySuffix: 'reports',
        securityPrivilege: SECURITY_PRIVILEGES.S_EXECUTION_REQUESTS_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_COMPONENTS,
        translationKeySuffix: 'components',
        securityPrivilege: SECURITY_PRIVILEGES.S_COMPONENTS_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_CONNECTIONS,
        translationKeySuffix: 'connections',
        securityPrivilege: SECURITY_PRIVILEGES.S_CONNECTIONS_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_DATASETS,
        translationKeySuffix: 'datasets',
        securityPrivilege: SECURITY_PRIVILEGES.S_DATASETS_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_TEMPLATES,
        translationKeySuffix: 'templates',
        securityPrivilege: SECURITY_PRIVILEGES.S_TEMPLATES_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_USERS,
        translationKeySuffix: 'users',
        securityPrivilege: SECURITY_PRIVILEGES.S_USERS_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_TEAMS,
        translationKeySuffix: 'teams',
        securityPrivilege: SECURITY_PRIVILEGES.S_TEAMS_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_SECURITY_GROUPS,
        translationKeySuffix: 'security_groups',
        securityPrivilege: SECURITY_PRIVILEGES.S_GROUPS_READ,
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_ENVIRONMENTS,
        translationKeySuffix: 'environments',
        securityPrivilege: SECURITY_PRIVILEGES.S_ENVIRONMENTS_READ,
    }),
];

function toMenuItem({
    routeKey,
    queryParams = {},
    translationKeySuffix,
    securityPrivilege,
}: {
    routeKey: ROUTE_KEYS;
    queryParams?: {
        [key: string]: string;
    };
    translationKeySuffix: string;
    securityPrivilege: SECURITY_PRIVILEGES;
}): IMenuItem {
    return {
        routeKey,
        queryParams,
        translationKey: `${TRANSLATION_PREFIX}.${translationKeySuffix}`,
        securityPrivilege,
    };
}
