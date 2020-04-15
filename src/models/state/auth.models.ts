export interface IAuthState {
    username: string;
    permissions?: Partial<IAccessLevel>;
}

// TODO once authentication mechanism
export interface IAccessLevel {
    edit: boolean;
    execute: boolean;
}
