import React from 'react';
import { Box } from '@material-ui/core';
import ShowUntilEnvConfigKnown from '../ShowUntilEnvConfigKnown';
import ThemeProvider from '../ThemeProvider';
import FlashMessages from '../FlashMessages';
import AppHeader from '../AppHeader';
import AppBody from '../AppBody';

function AppTemplate() {
    return (
        <ShowUntilEnvConfigKnown>
            <ThemeProvider
                render={(renderProps) => (
                    <Box height="100%">
                        <div>
                            <FlashMessages />
                        </div>
                        <Box display="flex" flexDirection="column" height="100%">
                            <AppHeader
                                toggleTheme={renderProps.toggleTheme}
                                currentTheme={renderProps.currentTheme}
                            />
                            <AppBody />
                        </Box>
                    </Box>
                )}
            />
        </ShowUntilEnvConfigKnown>
    );
}

export default AppTemplate;
