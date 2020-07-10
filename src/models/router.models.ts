import React from 'react';
import { RouteProps } from 'react-router-dom';
import { ROUTE_KEYS } from 'views/routes';
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
    executeOnRoute?: IExecuteOnRoute[];
}

export interface IExecuteOnRoute<ExecuteInput = {}> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: (input?: ExecuteInput) => any;
    executeInputSelector?: (props: { routeLocation: IRouteLocation }) => ExecuteInput;
    dispatchResult?: boolean; // default false
}

export interface INavigateToRoute {
    routeKey: ROUTE_KEYS;
    params?: IPathParams;
    queryParams?: IPathParams;
}

export interface IPathParams {
    [key: string]: number | string;
}

export interface IRouteLocation {
    routeKey: ROUTE_KEYS;
    path: string;
    url: string;
    params?: IPathParams;
}
