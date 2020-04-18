import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import NavLink from 'views/common/navigation/NavLink';
import renderChildComponentRoutes from 'views/common/navigation/renderChildComponentRoutes';

function ScriptReportsTemplate() {
    const { url, path } = useRouteMatch();

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <NavLink to={url} exact>Overview</NavLink>
                    </li>
                    <li>
                        <NavLink to={`${url}/123`}>detail</NavLink>
                    </li>
                </ul>
            </nav>
            <div>
                {renderChildComponentRoutes({ path })}
            </div>
        </div>
    );
}

export default ScriptReportsTemplate;
