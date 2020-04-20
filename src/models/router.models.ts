import React from 'react';
import { RouteProps } from 'react-router-dom';
import { IAccessLevel } from './state/auth.models';

export interface IRoutesMap<RouteKey = string> {
    [routeKey: string]: IRoute<RouteKey>;
}

export interface IRoute<RouteKey = string> extends RouteProps {
    routeKey: RouteKey;
    path: string;
    allowAnonymousAccess?: boolean; // default true // TODO default false once authentication mechanism
    requiredAccessLevels?: Partial<IAccessLevel>;
    template?: React.ElementType; // only used for parent routes (takes precedence there over the component prop)
    childRoutes?: IRoute<RouteKey>[];
}
