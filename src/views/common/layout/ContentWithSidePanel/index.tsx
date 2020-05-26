import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import GoBack from 'views/common/navigation/GoBack';
import { ROUTE_KEYS } from 'views/routes';

interface IPublicProps {
    panel: React.ReactNode;
    content: React.ReactNode;
    goBackTo?: ROUTE_KEYS;
    contentOverlay?: React.ReactNode;
    contentOverlayOpen?: boolean;
}

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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
}));

export default function ContentWithSidePanel({
    panel,
    content,
    goBackTo,
    contentOverlay,
    contentOverlayOpen,
}: IPublicProps) {
    const classes = useStyles();

    return (
        <Box display="flex" flex="1 1 auto">
            <Box
                display="flex"
                flexDirection="column"
                flex="1 1 auto"
                width={1 / 3}
                maxWidth={485}
                paddingTop={2}
                bgcolor="background.paper"
            >
                {goBackTo && (
                    <Box flex="0 0 auto">
                        <GoBack to={goBackTo} />
                    </Box>
                )}
                <Box
                    display="flex"
                    flexDirection="column"
                    flex="1 1 auto"
                    paddingX={2}
                    paddingBottom={2}
                    maxWidth="390px"
                    marginX="auto"
                >
                    {panel}
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                flex="1 1 auto"
                width={2 / 3}
                position="relative"
            >
                <Box padding={2} className={classes.content}>
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
    );
}
