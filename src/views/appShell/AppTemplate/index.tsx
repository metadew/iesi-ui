/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from 'react';
import { Box } from '@material-ui/core';
import ShowAfterEnvConfigKnown from '../ShowAfterEnvConfigKnown';
import ThemeProvider from '../ThemeProvider';
import FlashMessages from '../FlashMessages';
import AppHeader from '../AppHeader';
import AppBody from '../AppBody';

export default function AppTemplate(props: unknown) {
    const [height, setHeight] = useState(0);

    const measuredRef = useCallback((node) => {
        if (node !== null) {
            setHeight(node.getBoundingClientRect().height);
        }
    }, []);
    return (
        <ShowAfterEnvConfigKnown>
            <ThemeProvider
                render={(renderProps) => (
                    <Box height="100%">
                        <div>
                            <FlashMessages />
                        </div>
                        <Box
                            position="relative"
                            display="flex"
                            flexDirection="column"
                            minHeight="100%"
                        >
                            <AppHeader
                                toggleTheme={renderProps.toggleTheme}
                                currentTheme={renderProps.currentTheme}
                                forwardRef={measuredRef}
                            />
                            <AppBody offsetTop={Math.round(height)} />
                        </Box>
                    </Box>
                )}
            />
        </ShowAfterEnvConfigKnown>
    );
}
