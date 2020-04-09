import React, { ReactNode } from 'react';
import isSet from '@snipsonian/core/es/is/isSet';
import ShowAfterDelay from '@snipsonian/react/es/components/waiting/ShowAfterDelay';
import { observeXL } from 'views/observe';
import { ICustomAsyncEntity, StateChangeNotification } from 'models/state.models';
import { IEnvConfig } from 'models/state/envConfig.models';
import { getAsyncEnvConfig } from 'state/envConfig/selectors';

interface IPublicProps {
    children: ReactNode;
}

interface IPrivateProps {
    asyncEnvConfig: ICustomAsyncEntity<IEnvConfig>;
}

function ShowUntilEnvConfigKnown({ asyncEnvConfig, children }: IPublicProps & IPrivateProps) {
    const { data: envConfig } = asyncEnvConfig;

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

export default observeXL<IPrivateProps, IPublicProps>(
    {
        notifications: [StateChangeNotification.ENV_CONFIG],
        select: ({ state }) => ({
            asyncEnvConfig: getAsyncEnvConfig(state),
        }),
    },
    ShowUntilEnvConfigKnown,
);
