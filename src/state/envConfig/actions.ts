import { createAction } from '../index';
import { StateChangeNotification } from '../../models/state.models';
import { AsyncStatus } from '../../snipsonian/observable-state/src/actionableStore/entities/types';

// TODO reduce the boilerplate with an 'entities' mechanism?
// (or is this the exception because we keep it out of the 'entities' state part?)

export const fetchEnvConfig = () => createAction<{}>({
    type: 'FETCH_ENV_CONFIG',
    payload: {},
    async process({ getState, setState, api }) {
        let newState;
        try {
            newState = getState();
            newState.envConfig.fetch.status = AsyncStatus.Busy;

            setState({
                newState,
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG],
            });

            const envConfig = await api.envConfig.fetchEnvironmentConfig();

            newState = getState();
            newState.envConfig.fetch.status = AsyncStatus.Success;
            newState.envConfig.data = envConfig;

            setState({
                newState,
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG],
            });
        } catch (error) {
            newState = getState();
            newState.envConfig.fetch.status = AsyncStatus.Error;
            newState.envConfig.fetch.error = error;

            setState({
                newState,
                notificationsToTrigger: [StateChangeNotification.ENV_CONFIG],
            });
        }
    },
});
