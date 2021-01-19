import React, { useState } from 'react';
import { decode } from 'jsonwebtoken';

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
    setAuthenticated: (newToken: string) => void;
    isAuthenticated: () => boolean;
};

export const UserSessionContext = React.createContext<Partial<UserSession>>({});

export function UserSessionProvider({ children }: IUserSessionContextProps) {
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');

    function setAuthenticated(newToken: string) {
        setToken(newToken);

        const decoded: any = decode(token);

        if (decoded !== undefined) {
            sessionStorage.setItem('authorities', JSON.stringify(decoded.authorities));
            setUsername(decoded.sub);
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

    return (
        <UserSessionContext.Provider value={{ username, token, setAuthenticated, isAuthenticated }}>
            {children}
        </UserSessionContext.Provider>
    );
}
