import { IUser } from 'models/state/user.model';
import Cookie from 'js-cookie';
import cryptoJS from 'crypto-js';
import { getDecodedAccessToken } from 'state/auth/selectors';

export function getDecodedToken() {
    const encryptedCookie = Cookie.get('app_session');
    if (!encryptedCookie) {
        return {
            authorities: [],
            username: '',
        };
    }
    const decryptedCookieData = cryptoJS.AES.decrypt(encryptedCookie, process.env.REACT_APP_COOKIE_SECRET_KEY);
    const decryptedCookie = JSON.parse(decryptedCookieData.toString(cryptoJS.enc.Utf8));
    return getDecodedAccessToken(decryptedCookie.access_token);
}

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
