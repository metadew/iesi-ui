import API_URLS from 'api/apiUrls';
// eslint-disable-next-line import/no-cycle
import { get, post, put, remove } from 'api/requestWrapper';
import { IPageData } from 'models/state/iesiGeneric.models';
import {
    IFetchUsersListPayload,
    IUser,
    IUserBase,
    IUserByIdPayload,
    IUserByNamePayload,
    IUserEntity,
    IUserPasswordPostPayload,
    IUserPost,
} from 'models/state/user.model';
// eslint-disable-next-line import/no-cycle
import { getUsersWithDistinctTeams, getUserWithDistinctTeams } from 'utils/users/userUtils';

interface IUserResponse {
    _embedded: {
        users: IUser[];
    };
    page: IPageData;
}

export function fetchUsers({ pagination, filter, sort }: IFetchUsersListPayload) {
    return get<IUserEntity, IUserResponse>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.USERS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            users: getUsersWithDistinctTeams(data._embedded.users),
            page: data.page,
        }),
    });
}

export function fetchUser({ name }: IUserByNamePayload) {
    return get<IUserBase>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.USER_BY_NAME,
        pathParams: {
            name,
        },
        mapResponse: ({ data }) => getUserWithDistinctTeams(data),
    });
}

export function createUser(user: IUserPost) {
    return post<IUserPost>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.USER_CREATE,
        body: user,
        contentType: 'application/json',
    });
}

export function updateUser(user: IUserBase) {
    return put<IUserPost>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.USER_BY_ID,
        pathParams: {
            id: user.id,
        },
        body: user,
        contentType: 'application/json',
    });
}

export function deleteUser({ id }: IUserByIdPayload) {
    return remove<{}>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.USER_BY_ID,
        pathParams: {
            id,
        },

    });
}

export function updatePassword({ id, password }: IUserPasswordPostPayload) {
    return put<{}>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.USER_BY_ID_PASSWORD,
        pathParams: {
            id,
        },
        body: password,
    });
}
