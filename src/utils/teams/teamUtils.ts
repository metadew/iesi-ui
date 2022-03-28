import { ITeam } from 'models/state/team.model';

export function getUniqueIdFromTeam(team: ITeam) {
    return team ? team.id : null;
}

export function getTeamsWithDistinctUsers(teams: ITeam[]) {
    return teams.map((team) => {
        const users: string[] = [];
        return {
            ...team,
            users: team.roles.flatMap((role) => role.users.flatMap((user) => {
                if (!users.includes(user.username)) {
                    users.push(user.username);
                    return [user];
                }
                return [];
            })),
        };
    });
}

export function getTeamWithDistinctUsers(team: ITeam) {
    const users: string[] = [];
    return {
        ...team,
        users: team.roles.flatMap((role) => role.users.flatMap((user) => {
            if (!users.includes(user.username)) {
                users.push(user.username);
                return [user];
            }
            return [];
        })),
    };
}
