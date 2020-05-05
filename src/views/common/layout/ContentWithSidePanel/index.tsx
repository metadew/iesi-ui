import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import GoBack from 'views/common/navigation/GoBack';
import { ROUTE_KEYS } from 'views/routes';

interface IPublicProps {
    panel: React.ReactNode;
    content: React.ReactNode;
    goBackTo?: ROUTE_KEYS;
}

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    content: {
        padding: spacing(2),
        [breakpoints.up(1460)]: {
            paddingLeft: spacing(7),
            paddingRight: spacing(7),
        },
    },
}));

export default function ContentWithSidePanel({
    panel,
    content,
    goBackTo,
}: IPublicProps) {
    const classes = useStyles();

    return (
        <Box display="flex" flex="1 1 auto" paddingBottom={2}>
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
                padding={2}
                className={classes.content}
            >
                {content}
            </Box>
        </Box>
    );
}
