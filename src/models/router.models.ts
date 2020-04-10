import { RouteProps } from 'react-router-dom';

export interface IRoutes {
    [key: string]: IRoute;
}

interface IRoute extends RouteProps {
    path: string;
    permissions?: string;
}
