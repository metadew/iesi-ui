import React, { useState } from 'react';
import classNames from 'classnames';
import { makeStyles, Box, Button } from '@material-ui/core';
import { TTranslatorComponent } from 'models/i18n.models';
import { PlayArrowSharp } from '@material-ui/icons';

const SIDE_PANEL_WIDTH = 350;

const useStyles = makeStyles(({ palette, typography }) => ({
    panel: {
        background: palette.background.paper,
    },
    container: {
        width: `calc(100% + ${SIDE_PANEL_WIDTH}px)`,
        transition: 'transform .2s',
    },
    closed: {
        transform: `translateX(-${SIDE_PANEL_WIDTH}px)`,
    },
    open: {
        transform: 'translateX(0)',
    },
    toggle: {
        transform: 'rotate(-90deg)',
        transformOrigin: 'top right',
    },
    toggleButton: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        minWidth: 80,
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(12),
        textTransform: 'uppercase',
        '& .MuiButton-endIcon': {
            transform: 'rotate3d(0, 0, 1, 90deg)',
        },
    },
    toggleButtonActive: {
        '& .MuiButton-endIcon': {
            transform: 'rotate3d(0, 0, 1, -90deg)',
        },
    },
}));

interface IPublicProps {
    toggleLabel: TTranslatorComponent;
    panel: React.ReactNode;
    content: React.ReactNode;
}

export default function ContentWithSlideoutPanel({
    panel,
    content,
    toggleLabel,
}: IPublicProps) {
    const [isOpen, setIsOpen] = useState(false);
    const classes = useStyles();

    const containerClasses = classNames(classes.container, {
        [classes.closed]: !isOpen,
        [classes.open]: isOpen,
    });


    return (
        <Box display="flex" flex="1 1 auto" className={containerClasses}>
            <Box position="relative" className={classes.panel}>
                <Box
                    width={SIDE_PANEL_WIDTH}
                    paddingLeft={5}
                    paddingRight={5}
                    paddingTop={3}
                    paddingBottom={3}
                    height="100%"
                >
                    {panel}
                </Box>
                <Box position="absolute" top="0" right="0" className={classes.toggle} zIndex={1}>
                    <Button
                        className={classNames(classes.toggleButton, {
                            [classes.toggleButtonActive]: isOpen,
                        })}
                        onClick={togglePanel}
                        variant="contained"
                        disableElevation
                        endIcon={<PlayArrowSharp />}
                    >
                        {toggleLabel}
                    </Button>
                </Box>
            </Box>
            <Box flex="1 1 auto" position="relative">
                {content}
            </Box>
        </Box>
    );

    function togglePanel() {
        setIsOpen(!isOpen);
    }
}
