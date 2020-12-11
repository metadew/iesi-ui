/* eslint-disable no-unused-vars */
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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialUser: User = {
    id: '',
    firstName: '',
    lastName: '',
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
        console.log(token);

        const decoded: any = jwt.decode(token);
        // eslint-disable-next-line eqeqeq
        if (decoded != undefined) {
            sessionStorage.setItem('userName', decoded.sub);
            sessionStorage.setItem('role', JSON.stringify(decoded.authorities));
            sessionStorage.setItem('isAuthenticated', 'true');
            setUsername(decoded.sub);
            setRole(decoded.authorities);
        }
        console.log('Authentication has been set!');
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
