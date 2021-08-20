export interface IAuthenticationRequest {
    username: string;
    password: string;
}

export interface IAuthenticationResponse {
    accessToken: string;
    expiresIn: number;
}

export interface IAuthState {
    username: string;
    accessToken: string;
    permissions: IAccessLevel[];
}

export interface IAccessLevel {
    group: string;
    privilege: SECURITY_PRIVILEGES;
}

export interface IUserByIdPayload {
    uuid: string;
}

export interface IUser {
    username: string;
    id: string;
    enabled: boolean;
    expired: boolean;
    credentialsExpired: boolean;
    locked: boolean;
    roles: IUserRole[] ;
}

export interface IUserRole {
    id: string;
    name: string;
    team: IRoleTeam;
    privileges: IPrivilege[];
}

export interface IRoleTeam {
    id: string;
    name: string;
    securityGroups: ITeamSecurityGroup[];
}

export interface ITeamSecurityGroup {
    id: string;
    name: string;
}

export interface IPrivilege {
    id: string;
    privilege: string;
}

export enum SECURITY_PRIVILEGES {

    S_SCRIPTS_READ = 'SCRIPTS_READ',
    S_SCRIPTS_WRITE = 'SCRIPTS_WRITE',

    S_SCRIPT_EXECUTIONS_READ = 'SCRIPT_EXECUTIONS_READ',
    S_SCRIPT_EXECUTIONS_WRITE = 'SCRIPT_EXECUTIONS_WRITE',

    S_USERS_READ = 'USERS_READ',
    S_USERS_WRITE = 'USERS_WRITE',

    S_EXECUTION_REQUEST_WRITE = 'EXECUTION_REQUESTS_WRITE',
    S_EXECUTION_REQUEST_READ = 'EXECUTION_REQUESTS_READ',

    S_GROUPS_READ = 'GROUPS_READ',
    S_GROUPS_WRITE = 'GROUPS_WRITE',

    S_ENVIRONMENTS_READ = 'ENVIRONMENTS_READ',
    S_ENVIRONMENTS_WRITE = 'ENVIRONMENTS_WRITE',

    S_DATASETS_WRITE = 'DATASETS_WRITE',
    S_DATASETS_READ = 'DATASETS_READ',

    S_CONNECTIONS_WRITE = 'CONNECTIONS_WRITE',
    S_CONNECTIONS_READ = 'CONNECTIONS_READ',

    S_COMPONENTS_WRITE = 'COMPONENTS_WRITE',
    S_COMPONENTS_READ = 'COMPONENTS_READ',

    S_TEAMS_READ = 'TEAMS_READ',
    S_TEAMS_WRITE = 'TEAMS_WRITE',

    S_ROLES_WRITE = 'ROLES_WRITE',

}
