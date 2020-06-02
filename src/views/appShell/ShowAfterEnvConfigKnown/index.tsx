import React from 'react';
import isSet from '@snipsonian/core/es/is/isSet';
import ShowAfterDelay from '@snipsonian/react/es/components/waiting/ShowAfterDelay';
import { observe, IObserveProps, IPublicPropsWithChildren } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncEnvConfig } from 'state/envConfig/selectors';
import Loader from 'views/common/waiting/Loader';
import routeListener from '../RouteListener';

function ShowAfterEnvConfigKnown({ state, children }: IPublicPropsWithChildren & IObserveProps) {
    const envConfig = getAsyncEnvConfig(state).data;

    const waitingOnEnvConfig = !isSet(envConfig);

    if (!waitingOnEnvConfig) {
        /* start listening on route changes as soon as the envConfig (and the iesi api base url) is known */
        routeListener();
    }

    return (
        <ShowAfterDelay
            enabled={waitingOnEnvConfig}
            delayBeforeShow={0}
            minDurationToShow={400}
            showDuringDelayComponent={<ShowDuringDelay />}
        >
            {children}
        </ShowAfterDelay>
    );
}

function ShowDuringDelay() {
    return (
        <div className="ShowUntilEnvConfigKnown">
            <Loader showImmediately useFullScreen show />
        </div>
    );
}

export default observe<IPublicPropsWithChildren>(
    [StateChangeNotification.ENV_CONFIG],
    ShowAfterEnvConfigKnown,
);
