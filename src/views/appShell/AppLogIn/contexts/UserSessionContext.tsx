import React, { useState } from 'react';
import jwt from 'jsonwebtoken';

interface IUserSessionContextProps {
    children?: any;
}

type User = {
    id: string;
    firstName: string;
    lastName: string;
};

type UserSession = {
    username: string;
    token: string;
    setAuthenticated: any;
    isAuthenticated: any;
    isAdmin: any;
};


export const UserSessionContext = React.createContext<Partial<UserSession>>({});

export function UserSessionProvider({ children }: IUserSessionContextProps) {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');

    // eslint-disable-next-line no-shadow
    function setAuthenticated(token: string) {
        sessionStorage.setItem('token', token);
        setToken(token);

        const decoded: any = jwt.decode(token);

        if (decoded !== undefined) {
            sessionStorage.setItem('userName', decoded.sub);
            sessionStorage.setItem('authorities', JSON.stringify(decoded.authorities));
            console.log(JSON.parse(sessionStorage.getItem('authorities')));
            setUsername(decoded.sub);
            setRole(decoded.authorities);
        }
        if (decoded.sub !== '' && token !== '') {
            sessionStorage.setItem('isAuthenticated', 'true');
        } else {
            sessionStorage.setItem('isAuthenticated', 'false');
        }
    }

    function isAuthenticated() {
        return username !== '' && token !== '';
    }

    function isAdmin() {
        return role === 'admin';
    }

    return (
        <UserSessionContext.Provider value={{ username, token, setAuthenticated, isAuthenticated, isAdmin }}>
            {children}
        </UserSessionContext.Provider>
    );
}
