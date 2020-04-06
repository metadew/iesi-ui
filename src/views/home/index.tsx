import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { ROUTES } from '../routes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export default (props: RouteComponentProps) => (
    <div>
        <Typography variant="h2">Home</Typography>
        <Button variant="contained" color="primary" href={ROUTES.REACT_START_PAGE}>
            Go to React Start Page
        </Button>
    </div>
);
