import React from 'react';
import { SnackbarProvider } from 'notistack';
import FlashMessageManager from './FlashMessageManager';

export default function FlashMessages() {
    return (
        <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        >
            <FlashMessageManager />
        </SnackbarProvider>
    );
}
