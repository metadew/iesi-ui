import { ROUTE_KEYS } from 'views/routes';
import { checkAuthority, SECURITY_PRIVILEGES } from 'views/appShell/AppLogIn/components/AuthorithiesChecker';

const TRANSLATION_PREFIX = 'app_shell.header.menu';

export interface IMenuItem {
    routeKey: ROUTE_KEYS;
    translationKey: string;
}

export const MAIN_NAV_ITEMS: IMenuItem[] = [].concat(
    checkAuthority(SECURITY_PRIVILEGES.S_SCRIPT_EXECUTIONS_READ, 'PUBLIC')
        ? toMenuItem({
            routeKey: ROUTE_KEYS.R_SCRIPTS,
            translationKeySuffix: 'scripts',
        }) : [],
    checkAuthority(SECURITY_PRIVILEGES.S_SCRIPT_EXECUTIONS_READ, 'PUBLIC')
        ? toMenuItem({
            routeKey: ROUTE_KEYS.R_REPORTS,
            translationKeySuffix: 'reports',
        }) : [],
);

function toMenuItem({
    routeKey,
    translationKeySuffix,
}: {
    routeKey: ROUTE_KEYS;
    translationKeySuffix: string;
}): IMenuItem {
    return {
        routeKey,
        translationKey: `${TRANSLATION_PREFIX}.${translationKeySuffix}`,
    };
}
