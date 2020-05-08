import React from 'react';
import { Button, IconButton, Box, makeStyles } from '@material-ui/core';
import {
    AddRounded as AddIcon,
    Save as SaveIcon,
    PlayArrow as PlayIcon,
    Delete as DeleteIcon,
} from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

interface IPublicProps {
    onPlay: () => void;
    onDelete: () => void;
    onAdd: () => void;
    onSave: () => void;
}

const useStyles = makeStyles(({ palette, overrides, shape, spacing }) => ({
    addButton: overrides.MuiButton.contained,
    actions: {
        borderRadius: shape.borderRadius,
        backgroundColor: palette.grey[200],
    },
    action: {
        '&:not(:first-child)': {
            marginLeft: spacing(1),
        },
    },
}));

export default function DetailActions({
    onPlay,
    onDelete,
    onAdd,
    onSave,
}: IPublicProps) {
    const classes = useStyles();
    return (
        <Box
            paddingLeft={5}
            paddingRight={5}
            marginBottom={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <IconButton className={classes.addButton} onClick={onAdd}>
                <AddIcon fontSize="large" />
            </IconButton>
            <Box className={classes.actions} padding={0.8}>
                <Button
                    className={classes.action}
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={onSave}
                >
                    <Translate msg="common.action.save" />
                </Button>
                <IconButton className={classes.action} size="small" onClick={onDelete}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton className={classes.action} size="small" onClick={onPlay}>
                    <PlayIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}
