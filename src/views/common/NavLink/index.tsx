import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Link, LinkGetProps } from '@reach/router';
import { ROUTES } from '../../routes';

interface IPublicProps {
    route: ROUTES | string; // for url params
    className?: string;
    children: ReactNode;
}

const ACTIVE_CLASS_NAME = 'active';

const NavLink = (props: IPublicProps) => (
    <Link
        to={props.route}
        getProps={({ isPartiallyCurrent, isCurrent }: LinkGetProps) => {
            const isIndexPage = props.route === './';
            let shouldGetActiveClass = false;

            if (isIndexPage) {
                shouldGetActiveClass = !!isCurrent;
            } else {
                shouldGetActiveClass = !!isPartiallyCurrent;
            }

            return {
                className: classNames(props.className, {
                    [ACTIVE_CLASS_NAME]: !!shouldGetActiveClass,
                }),
            };
        }}
    >
        {props.children}
    </Link>
);

export default NavLink;
