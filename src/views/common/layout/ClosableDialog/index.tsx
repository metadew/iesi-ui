import React, { ReactNode } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { Box, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles(({ palette, spacing }) => ({
    dialogContent: {
        backgroundColor: palette.background.default,
        textAlign: 'center',
    },
    dialogHeader: {
        backgroundColor: palette.background.paper,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: spacing(2),
        right: spacing(2),
    },
}));

interface IPublicProps {
    title: string;
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    contentClassName?: string;
}

export default function ClosableDialog({
    onClose,
    open,
    title,
    children,
    contentClassName,
    ...dialogProps
}: IPublicProps & DialogProps) {
    const classes = useStyles();

    return (
        <Dialog onClose={onClose} aria-labelledby="closable-dialog" open={open} {...dialogProps}>
            <Box className={classes.dialogHeader} paddingY={3} paddingX={7} position="relative">
                <Typography variant="h3">{title}</Typography>
                <IconButton size="small" onClick={onClose} className={classes.closeButton}>
                    <Close />
                </IconButton>
            </Box>
            <Box className={`${classes.dialogContent} ${contentClassName}`} padding={3}>
                {children}
            </Box>
        </Dialog>
    );
}
