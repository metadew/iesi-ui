import React from 'react';
import { Box } from '@material-ui/core';

interface IPublicProps {
    children: React.ReactNode;
}

function AppTemplateContainer({ children }: IPublicProps) {
    return (
        <Box marginLeft={3} marginRight={3}>
            {children}
        </Box>
    );
}

export default AppTemplateContainer;
