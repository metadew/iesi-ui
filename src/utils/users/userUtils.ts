import { IUser } from 'models/state/user.model';

export function getUniqueIdFromUser(user: IUser) {
    return user ? user.id : null;
}

export function getUsersWithDistinctTeams(users: IUser[]) {
    return users.map((user) => {
        const teams: string[] = [];
        return {
            ...user,
            teams: user.roles.flatMap((role) => {
                if (!teams.includes(role.team.name)) {
                    teams.push(role.team.name);
                    return [role.team];
                }
                return [];
            }),
        };
    });
}

export function getUserWithDistinctTeams(user: IUser) {
    const teams: string[] = [];
    return {
        ...user,
        teams: user.roles.flatMap((role) => {
            if (!teams.includes(role.team.name)) {
                teams.push(role.team.name);
                return [role.team];
            }
            return [];
        }),
    };
}
