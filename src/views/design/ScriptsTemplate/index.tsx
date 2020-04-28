import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import ChildComponentRoutes from 'views/common/navigation/ChildComponentRoutes';
import { Container } from '@material-ui/core';

function ScriptsTemplate() {
    const { path } = useRouteMatch();

    return (
        <Container>
            <ChildComponentRoutes path={path} />
        </Container>
    );
}

export default ScriptsTemplate;
