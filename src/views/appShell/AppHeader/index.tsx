import React from 'react';
import { Typography } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import MainNav from '../MainNav';
import MockPermissions from './MockPermissions';

export default function AppHeader() {
    return (
        <>
            <MockPermissions />
            <Typography variant="h1">
                <Translate msg="app_shell.header.title" raw />
            </Typography>
            <MainNav />
        </>
    );
}
