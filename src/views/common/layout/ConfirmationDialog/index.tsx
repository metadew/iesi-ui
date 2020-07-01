import React from 'react';
import { Typography, Button, Box, makeStyles } from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import ClosableDialog from '../ClosableDialog';

const useStyles = makeStyles(({ spacing }) => ({
    cancelButton: {
        marginTop: spacing(2),
        textDecoration: 'underline',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
}));

interface IPublicProps {
    title: string;
    text: string;
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
        <ClosableDialog onClose={onClose} title={title} open={open}>
            <Typography>{text}</Typography>
            <Box marginTop={4} display="flex" flexDirection="column" alignItems="center">
                <Button variant="contained" color="secondary" onClick={onConfirm}>
                    <Translate msg="common.confirmation.yes" />
                </Button>
                <Button className={classes.cancelButton} size="small" onClick={onClose}>
                    <Translate msg="common.confirmation.no" />
                </Button>
            </Box>
        </ClosableDialog>
    );
}
