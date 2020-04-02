import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Typography } from '@material-ui/core';
import { teammembers } from '../index';

interface IMemberComponentProps extends RouteComponentProps {
    memberId?: string;
}

export default (props: IMemberComponentProps) => {
    const { memberId } = props;
    const member = teammembers.find((m) => m.id === memberId);

    if (!member) {
        return (
            <div>
                <Typography variant="h4">Member: Niet gevonden.</Typography>
            </div>
        );
    }

    return (
        <div>
            <Typography variant="h4">
                Member:
                {member.firstName}
                {' '}
                {member.lastName}
            </Typography>
        </div>
    );
};
