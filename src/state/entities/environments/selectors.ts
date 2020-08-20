import { IState } from 'models/state.models';
import { IEnvironment } from 'models/state/environments.models';

export const getAsyncEnvironments = (state: IState) => state.entities.environments;

export const getEnvironmentsForDropdown = (state: IState) => {
    const asyncEnvironments = getAsyncEnvironments(state);
    const environments = asyncEnvironments.data || [] as IEnvironment[];
    return environments.map((environment) => environment.name);
};
