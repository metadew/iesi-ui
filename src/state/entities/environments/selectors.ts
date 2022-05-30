import { IState } from 'models/state.models';
import { IEnvironment } from 'models/state/environments.models';

export const getAsyncEnvironments = (state: IState) => state.entities.environments;

export const getAsyncEnvironmentsEntity = (state: IState) => {
    const environmentsEntity = getAsyncEnvironments(state);
    return environmentsEntity && environmentsEntity.data && environmentsEntity.data.environments
        ? environmentsEntity.data.environments : [] as IEnvironment[];
};

export const getEnvironmentsForDropdown = (state: IState) => {
    const asyncEnvironments = getAsyncEnvironments(state);
    const environments = asyncEnvironments.data.environments || [] as IEnvironment[];
    return environments.map((environment) => environment.name);
};

export const getAsyncEnvironmentsPageData = (state: IState) => {
    const environmentsEntity = getAsyncEnvironments(state);
    return environmentsEntity && environmentsEntity.data ? environmentsEntity.data.page : null;
};

export const getAsyncEnvironmentDetail = (state: IState) => state.entities.environmentDetail;
