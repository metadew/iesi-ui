import React, { ReactNode } from 'react';
import isSet from '@snipsonian/core/es/is/isSet';
import ShowAfterDelay from '@snipsonian/react/es/components/waiting/ShowAfterDelay';
import { observe, IObserveProps } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncEnvConfig } from 'state/envConfig/selectors';

interface IPublicProps {
    children: ReactNode;
}

function ShowUntilEnvConfigKnown({ state, children }: IPublicProps & IObserveProps) {
    const envConfig = getAsyncEnvConfig(state).data;

    const waitingOnEnvConfig = !isSet(envConfig);

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
            Loading while fetching env config ...
        </div>
    );
}

export default observe<IPublicProps>(
    [StateChangeNotification.ENV_CONFIG],
    ShowUntilEnvConfigKnown,
);
