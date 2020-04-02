import React from 'react';
import { Typography } from '@material-ui/core';
import NavLink from '../common/NavLink';
import { INestedRouteComponentProps } from '../../models/router.models';
import { ROUTES } from '../routes';

export default (props: INestedRouteComponentProps) => (
    <div>
        <Typography variant="h2">About</Typography>
        <nav>
            <ul>
                <li><NavLink route={ROUTES.CURRENT_INDEX_PAGE}>About home</NavLink></li>
                <li><NavLink route={ROUTES.ABOUT_TEAM}>Team</NavLink></li>
            </ul>
        </nav>
        {props.children}
    </div>
);
