import { ReactNode } from 'react';
import { RouteComponentProps } from '@reach/router';

export interface INestedRouteComponentProps extends RouteComponentProps {
    children: ReactNode;
}
