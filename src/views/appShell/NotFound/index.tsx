import React from 'react';
import { Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export default (props: RouteComponentProps) => (
    <div>
        <Typography variant="h2">Not Found</Typography>
        <Typography variant="body1">Sorry, nothing here.</Typography>
    </div>
);
