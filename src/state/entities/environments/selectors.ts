import { IState } from 'models/state.models';
import { IEnvironment } from 'models/state/environments.models';

export const getAsyncEnvironmentsEntity = (state: IState) => state.entities.environments;

export const getAsyncEnvironments = (state: IState) => {
    const environmentsEntity = getAsyncEnvironmentsEntity(state);
    return environmentsEntity && environmentsEntity.data && environmentsEntity.data.environments
        ? environmentsEntity.data.environments : [] as IEnvironment[];
};
export const getEnvironmentsForDropdown = (state: IState) => {
    const asyncEnvironments = getAsyncEnvironmentsEntity(state);
    const environments = asyncEnvironments.data.environments || [] as IEnvironment[];
    return environments.map((environment) => environment.name);
};

export const getAsyncEnvironmentsPageData = (state: IState) => {
    const environmentsEntity = getAsyncEnvironmentsEntity(state);
    return environmentsEntity && environmentsEntity.data ? environmentsEntity.data.page : null;
};

export const getAsyncEnvironmentDetail = (state: IState) => state.entities.environmentDetail;
