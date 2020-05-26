import React from 'react';
import { Button, IconButton, Box, makeStyles, Paper } from '@material-ui/core';
import {
    AddRounded as AddIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
    InsertChart as ReportIcon,
    PlayArrowRounded as PlayIcon,
} from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { THEME_COLORS } from 'config/themes/colors';

interface IPublicProps {
    onPlay: () => void;
    onDelete: () => void;
    onAdd: () => void;
    onSave: () => void;
    onViewReport: () => void;
}

const useStyles = makeStyles(({ spacing }) => ({
    actions: {
        padding: `${spacing(0.5)}px ${spacing(1)}px`,
        backgroundColor: THEME_COLORS.GREY_LIGHT,
        '& .MuiIconButton-root': {
            padding: spacing(0.8),
            margin: `${spacing(0.2)}px ${spacing(0.5)}px`,
        },
    },
    addButton: {
        backgroundColor: THEME_COLORS.GREY_LIGHT,
    },
}));

export default function DetailActions({
    onPlay,
    onDelete,
    onAdd,
    onSave,
    onViewReport,
}: IPublicProps) {
    const classes = useStyles();
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" marginX={2.2}>
            <Box flex="0 0 auto">
                <IconButton aria-label="add action" className={classes.addButton} onClick={onAdd}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Box flex="0 0 auto">
                <Paper elevation={0} className={classes.actions}>
                    <Box display="inline" marginRight={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<SaveIcon />}
                            onClick={onSave}
                        >
                            <Translate msg="Save" />
                        </Button>
                    </Box>
                    <IconButton aria-label="delete script" onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="view reports" onClick={onViewReport}>
                        <ReportIcon />
                    </IconButton>
                    <IconButton aria-label="execute script" onClick={onPlay}>
                        <PlayIcon />
                    </IconButton>
                </Paper>
            </Box>
        </Box>
    );
}
