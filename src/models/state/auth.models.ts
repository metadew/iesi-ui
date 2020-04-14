import { IAccessLevel } from 'models/router.models';

export interface IAuthState {
    username: string;
    permissions?: Partial<IAccessLevel>;
}
