import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { TTranslatorComponent } from 'models/i18n.models';
import { Typography, Button, Box, makeStyles, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

const useStyles = makeStyles(({ palette, spacing }) => ({
    dialogContent: {
        backgroundColor: palette.background.default,
        textAlign: 'center',
    },
    dialogHeader: {
        backgroundColor: palette.background.paper,
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: spacing(2),
        textDecoration: 'underline',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    closeButton: {
        position: 'absolute',
        top: spacing(2),
        right: spacing(2),
    },
}));

interface IPublicProps {
    title: TTranslatorComponent;
    text: TTranslatorComponent;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmationDialog({
    onClose,
    onConfirm,
    open,
    title,
    text,
}: IPublicProps) {
    const classes = useStyles();

    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
            <Box className={classes.dialogHeader} padding={3} position="relative">
                <Typography variant="h3">{title}</Typography>
                <IconButton size="small" onClick={onClose} className={classes.closeButton}>
                    <Close />
                </IconButton>
            </Box>
            <Box className={classes.dialogContent} minWidth={500} minHeight={200} padding={3}>
                <Typography>{text}</Typography>
                <Box marginTop={4} display="flex" flexDirection="column" alignItems="center">
                    <Button variant="contained" color="secondary" onClick={onConfirm}>
                        <Translate msg="common.confirmation.yes" />
                    </Button>
                    <Button className={classes.cancelButton} size="small" onClick={onClose}>
                        <Translate msg="common.confirmation.no" />
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
