import React from 'react';
import { SnackbarProvider } from 'notistack';
import {
    makeStyles,
    createStyles,
} from '@material-ui/core';
import FlashMessageManager from './FlashMessageManager';


const useSnackbarStyles = makeStyles(({ palette }) => createStyles({
    variantSuccess: {
        background: palette.success.main,
    },
    variantInfo: {
        background: palette.info.main,
    },
    variantWarning: {
        background: palette.warning.main,
    },
    variantError: {
        background: palette.error.main,
    },
}));

export default function FlashMessages() {
    const snackbarClasses = useSnackbarStyles();

    return (
        <SnackbarProvider
            classes={snackbarClasses}
            maxSnack={4}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
            <FlashMessageManager />
        </SnackbarProvider>
    );
}
