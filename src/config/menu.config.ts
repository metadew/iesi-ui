import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { ROUTE_KEYS } from 'views/routes';

const TRANSLATION_PREFIX = 'app_shell.header.menu';

export interface IMenuItem {
    routeKey: ROUTE_KEYS;
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
        routeKey: ROUTE_KEYS.R_USERS,
        translationKeySuffix: 'users',
        securityPrivilege: SECURITY_PRIVILEGES.S_USERS_READ,
    })
];

function toMenuItem({
    routeKey,
    translationKeySuffix,
    securityPrivilege,
}: {
    routeKey: ROUTE_KEYS;
    translationKeySuffix: string;
    securityPrivilege: SECURITY_PRIVILEGES;
}): IMenuItem {
    return {
        routeKey,
        translationKey: `${TRANSLATION_PREFIX}.${translationKeySuffix}`,
        securityPrivilege,
    };
}
