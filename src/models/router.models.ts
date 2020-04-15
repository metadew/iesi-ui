import { RouteProps } from 'react-router-dom';

export interface IRoutes {
    [key: string]: IRoute;
}

export interface IAccessLevel {
    edit: boolean;
    execute: boolean;
}

interface IRoute extends RouteProps {
    path: string;
    allowAnonymousAccess?: boolean; // default true // TODO default false once authentication mechanism
    requiredAccessLevels?: Partial<IAccessLevel>; // TODO once authentication mechanism
}
