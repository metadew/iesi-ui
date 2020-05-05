import React from 'react';
import { Box } from '@material-ui/core';

interface IPublicProps {
    children: React.ReactNode;
}

function AppTemplateContainer({ children }: IPublicProps) {
    return (
        <Box marginLeft={5} marginRight={5}>
            {children}
        </Box>
    );
}

export default AppTemplateContainer;
