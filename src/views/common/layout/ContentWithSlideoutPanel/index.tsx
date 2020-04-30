import React, { useState } from 'react';
import classnames from 'classnames';
import { makeStyles, Box, Button } from '@material-ui/core';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import { TTranslatorComponent } from 'models/i18n.models';

const useStyles = makeStyles(({ palette }) => ({
    panel: {
        background: palette.background.default,
        transition: 'all .5s ease-out',
    },
    closed: {
        width: 0,
        transform: 'translateX(-100%)',
    },
    open: {
        width: 300,
        transform: 'translateX(0)',
    },
    inner: {
        transition: 'all .5s ease-out',
    },
    innerClosed: {
        opacity: 0,
    },
    innerOpen: {
        opacity: 1,
    },
    toggle: {
        transform: 'rotate(-90deg)',
        transformOrigin: 'top right',
    },
    toggleButton: {
        minWidth: 80,
        fontWeight: 700,
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

    const panelClasses = classnames(classes.panel, {
        [classes.closed]: !isOpen,
        [classes.open]: isOpen,
    });

    const panelInnerClasses = classnames(classes.inner, {
        [classes.innerClosed]: !isOpen,
        [classes.innerOpen]: isOpen,
    });

    return (
        <Box display="flex" flex="1 1 auto">
            <Box position="relative" className={panelClasses}>
                <Box width={300} padding={3} height="100%" className={panelInnerClasses}>
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
                <AppTemplateContainer>
                    {content}
                </AppTemplateContainer>
            </Box>
        </Box>
    );

    function togglePanel() {
        setIsOpen(!isOpen);
    }
}
