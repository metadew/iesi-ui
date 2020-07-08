import { IState } from 'models/state.models';

export const getAsyncEnvironments = (state: IState) => state.entities.environments;
