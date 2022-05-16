import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import React, { useEffect } from 'react';
import { checkAuthority } from 'state/auth/selectors';
import { ROUTE_KEYS, redirectTo } from 'views/routes';
import { IObserveProps, observe } from './observe';

function Home({ state }: IObserveProps) {
    useEffect(() => {
        redirectTo({
            // eslint-disable-next-line max-len
            routeKey: checkAuthority(state, SECURITY_PRIVILEGES.S_USERS_READ) && checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_READ) ? (
                ROUTE_KEYS.R_SCRIPTS
            ) : checkAuthority(state, SECURITY_PRIVILEGES.S_USERS_READ) && (
                ROUTE_KEYS.R_USERS
            ),
        });
    }, [state]);

    return (
        <div />
    );
}

export default observe<{}>([], Home);
