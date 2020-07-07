import React, { useState } from 'react';
import classNames from 'classnames';
import { Box, makeStyles, Button } from '@material-ui/core';
import GoBack from 'views/common/navigation/GoBack';
import { ROUTE_KEYS } from 'views/routes';
import { TTranslatorComponent } from 'models/i18n.models';
import { PlayArrowSharp } from '@material-ui/icons';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';

interface IPublicProps {
    panel: React.ReactNode;
    content: React.ReactNode;
    goBackTo?: ROUTE_KEYS;
    contentOverlay?: React.ReactNode;
    contentOverlayOpen?: boolean;
    toggleLabel: TTranslatorComponent;
    showLoader?: boolean | AsyncStatus;
}

const SIDE_PANEL_WIDTH_MOBILE = 350;

const useStyles = makeStyles(({ spacing, breakpoints, palette, typography }) => ({
    container: {
        width: `calc(100% + ${SIDE_PANEL_WIDTH_MOBILE}px)`,
        transition: 'transform .2s',
        [breakpoints.up('md')]: {
            width: '100%',
        },
    },
    closed: {
        transform: `translateX(-${SIDE_PANEL_WIDTH_MOBILE}px)`,
        [breakpoints.up('md')]: {
            transform: 'translateX(0)',
        },
    },
    open: {
        transform: 'translateX(0)',
    },
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
    content: {
        padding: spacing(2),
        [breakpoints.up(1460)]: {
            paddingLeft: spacing(7),
            paddingRight: spacing(7),
        },
    },
    contentOverlay: {
        backgroundColor: 'rgba(51, 65, 85, 0.9)',
    },
    toggle: {
        transform: 'rotate3d(0, 0, 1, -90deg) translate3d(-100%, 0, 0)',
        transformOrigin: 'top left',
    },
    toggleButton: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
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

export default function ContentWithSidePanel({
    panel,
    content,
    goBackTo,
    contentOverlay,
    contentOverlayOpen,
    toggleLabel,
    showLoader,
}: IPublicProps) {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {goBackTo && (
                <Box display={{ xs: 'block', md: 'none' }} paddingY={2} className={classes.header}>
                    <GoBack to={goBackTo} />
                </Box>
            )}
            <Box
                display="flex"
                flex="1 1 auto"
                className={classNames(classes.container, {
                    [classes.closed]: !isOpen,
                    [classes.open]: isOpen,
                })}
            >
                <Loader show={showLoader} />
                <Box
                    position="absolute"
                    top={0}
                    left={SIDE_PANEL_WIDTH_MOBILE}
                    className={classes.toggle}
                    zIndex={1}
                    display={{ md: 'none' }}
                >
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
                <Box
                    display="flex"
                    flexDirection="column"
                    flex={{ xs: '0 0 auto', md: '1 1 auto' }}
                    width={{ xs: SIDE_PANEL_WIDTH_MOBILE, md: 1 / 3 }}
                    maxWidth={{ md: 485 }}
                    paddingTop={2}
                    bgcolor="background.paper"
                >
                    {goBackTo && (
                        <Box flex="0 0 auto" display={{ xs: 'none', md: 'block' }}>
                            <GoBack to={goBackTo} />
                        </Box>
                    )}
                    <Box
                        display="flex"
                        flexDirection="column"
                        flex="1 1 auto"
                        paddingX={2}
                        paddingBottom={2}
                        maxWidth={{ xs: '100%', md: 390 }}
                        width="100%"
                        marginX="auto"
                    >
                        {panel}
                    </Box>
                </Box>
                <Box
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    flex="1 1 auto"
                    width={{ xs: '100%', md: 2 / 3 }}
                    paddingLeft={{ xs: 1, md: 0 }}
                >
                    <Box display="flex" flexDirection="column" flex="1 0 auto" padding={2} className={classes.content}>
                        {content}
                    </Box>
                    {contentOverlayOpen && (
                        <Box
                            className={classes.contentOverlay}
                            position="absolute"
                            display="flex"
                            top="0"
                            bottom="0"
                            left="0"
                            right="0"
                        >
                            <Box
                                paddingX={4}
                                paddingY={8}
                                width="100%"
                            >
                                {contentOverlay}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );

    function togglePanel() {
        setIsOpen(!isOpen);
    }
}
