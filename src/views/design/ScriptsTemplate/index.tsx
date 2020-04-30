import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import ChildComponentRoutes from 'views/common/navigation/ChildComponentRoutes';

function ScriptsTemplate() {
    const { path } = useRouteMatch();

    return (
        <ChildComponentRoutes path={path} />
    );
}

export default ScriptsTemplate;
