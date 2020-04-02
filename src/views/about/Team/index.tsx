import React from 'react';
import { Typography } from '@material-ui/core';
import NavLink from '../../common/NavLink';
import { INestedRouteComponentProps } from '../../../models/router.models';
import { ROUTES } from '../../routes';

interface ITeamMember {
    id: string;
    firstName: string;
    lastName: string;
}

export const teammembers: ITeamMember[] = [
    {
        id: '1',
        firstName: 'Dries',
        lastName: 'Beerten',
    },
    {
        id: '2',
        firstName: 'Ben',
        lastName: 'Verbist',
    },
    {
        id: '3',
        firstName: 'Steve',
        lastName: 'Gybels',
    },
];

export default (props: INestedRouteComponentProps) => (
    <div>
        <Typography variant="h3">Team</Typography>
        <nav>
            <ul>
                <li><NavLink route={ROUTES.CURRENT_INDEX_PAGE}>Overview</NavLink></li>
                {teammembers.map((member) => (
                    <li key={member.id}>
                        <NavLink route={member.id}>{member.firstName}</NavLink>
                    </li>
                ))}
            </ul>
        </nav>
        {props.children}
    </div>
);
