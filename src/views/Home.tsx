import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import React, { useEffect } from 'react';
import { checkAuthority } from 'state/auth/selectors';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import { IObserveProps, observe } from './observe';

function Home({ state }: IObserveProps) {
    // eslint-disable-next-line max-len
    const isNotSysAdmin = checkAuthority(state, SECURITY_PRIVILEGES.S_USERS_READ) && checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_READ);
    const isSysAdmin = checkAuthority(state, SECURITY_PRIVILEGES.S_USERS_READ);

    useEffect(() => {
        redirectTo({
            // eslint-disable-next-line max-len
            routeKey: isNotSysAdmin ? (
                ROUTE_KEYS.R_SCRIPTS
            ) : isSysAdmin ? (
                ROUTE_KEYS.R_USERS
            ) : (
                ROUTE_KEYS.R_LOGIN
            ),
        });
    }, [isNotSysAdmin, isSysAdmin, state]);

    return (
        <div />
    );
}

export default observe<{}>([], Home);
