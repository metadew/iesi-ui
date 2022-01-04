import { IState } from 'models/state.models';
import { IUser } from 'models/state/user.model';

export const getAsyncUsersEntity = (state: IState) => state.entities.users;

export const getAsyncUsers = (state: IState) => {
    const usersEntity = getAsyncUsersEntity(state);
    return usersEntity && usersEntity.data && usersEntity.data.users
        ? usersEntity.data.users : [] as IUser[];
};

export const getAsyncUsersPageData = (state: IState) => {
    const usersEntity = getAsyncUsersEntity(state);
    return usersEntity && usersEntity.data ? usersEntity.data.page : null;
};

export const getAsyncUserDetail = (state: IState) => state.entities.userDetail;

export const getAsyncUserDetailRole = (state: IState) => state.entities.userDetailRole;
