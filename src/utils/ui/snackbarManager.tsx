import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider, useSnackbar, OptionsObject } from 'notistack';

// add a <div> child to body under which to mount the snackbars
const mountPoint = document.createElement('div');
mountPoint.id = 'snackbar';
document.body.appendChild(mountPoint);

export default {
    success: function success(msg: string) {
        this.toast(msg, { variant: 'success' });
    },
    warning: function warning(msg: string) {
        this.toast(msg, { variant: 'warning' });
    },
    info: function info(msg: string) {
        this.toast(msg, { variant: 'info' });
    },
    error: function error(msg: string) {
        this.toast(msg, { variant: 'error' });
    },
    toast: function toast(msg: string, options: OptionsObject) {
        const ShowSnackbar = (): ReactElement => {
            const { enqueueSnackbar } = useSnackbar();
            enqueueSnackbar(msg, options);
            return null;
        };
        ReactDOM.render(
            // see https://github.com/iamhosseindhv/notistack#snackbarprovider
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <ShowSnackbar />
            </SnackbarProvider>,
            mountPoint,
        );
    },
};
