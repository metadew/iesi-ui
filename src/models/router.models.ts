import { RouteProps } from 'react-router-dom';

export interface IRoutes {
    [key: string]: IRoute;
}

interface IRoute extends RouteProps {
    path: string;
    allowAnonymousAccess?: boolean; // default true // TODO default false once authentication mechanism
    permissions?: string; // TODO once authentication mechanism
}
