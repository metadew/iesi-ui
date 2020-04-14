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
    requiredAccessLevels?: Partial<IAccessLevel>;
}
