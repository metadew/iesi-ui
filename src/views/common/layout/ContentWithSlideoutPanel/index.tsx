import React, { useState } from 'react';
import classnames from 'classnames';
import { makeStyles, Box, Button } from '@material-ui/core';
import { TTranslatorComponent } from 'models/i18n.models';

const SIDE_PANEL_WIDTH = 350;

const useStyles = makeStyles(({ palette }) => ({
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
        minWidth: 80,
        fontWeight: 700,
        fontSize: '.8rem',
        textTransform: 'uppercase',
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

    const containerClasses = classnames(classes.container, {
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
                <Box position="absolute" top="0" right="0" className={classes.toggle}>
                    <Button
                        className={classes.toggleButton}
                        onClick={togglePanel}
                        variant="contained"
                        disableElevation
                    >
                        {toggleLabel}
                    </Button>
                </Box>
            </Box>
            <Box flex="1 1 auto">
                {content}
            </Box>
        </Box>
    );

    function togglePanel() {
        setIsOpen(!isOpen);
    }
}
