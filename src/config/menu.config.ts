import { ROUTE_KEYS } from 'views/routes';

const TRANSLATION_PREFIX = 'app_shell.header.menu';

export interface IMenuItem {
    routeKey: ROUTE_KEYS;
    translationKey: string;
}

export const MAIN_NAV_ITEMS: IMenuItem[] = [
    toMenuItem({
        routeKey: ROUTE_KEYS.R_SCRIPTS,
        translationKeySuffix: 'scripts',
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_REPORTS,
        translationKeySuffix: 'reports',
    }),
    toMenuItem({
        routeKey: ROUTE_KEYS.R_COMPONENTS,
        translationKeySuffix: 'components',
    }),
];

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
