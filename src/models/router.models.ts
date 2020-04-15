import { RouteProps } from 'react-router-dom';
import { IAccessLevel } from './state/auth.models';

export interface IRoutes {
    [key: string]: IRoute;
}

interface IRoute extends RouteProps {
    path: string;
    allowAnonymousAccess?: boolean; // default true // TODO default false once authentication mechanism
    requiredAccessLevels?: Partial<IAccessLevel>;
}
