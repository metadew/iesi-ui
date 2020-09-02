import React from 'react';
import classNames from 'classnames';
import {
    TooltipProps,
    Icon as MuiIcon,
    makeStyles,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import Tooltip from './Tooltip';

interface IPublicProps extends Omit<TooltipProps, 'children'> {
    icon?: React.ReactNode;
    iconSize?: 'inherit' | 'default' | 'small';
}

const useStyles = makeStyles(({ spacing, typography }) => ({
    tooltipIcon: {
        position: 'relative',
        top: '-2px',
        marginLeft: spacing(0.5),
        verticalAlign: 'middle',
        lineHeight: 0,
        '&.small': {
            fontSize: typography.pxToRem(17),
        },
        '&.inherit': {
            fontSize: 'inherit',
        },
        '& > svg': {
            fontSize: 'inherit',
        },
    },
}));

export default function InfoTooltip({
    iconSize = 'default',
    icon,
    ...restProps
}: IPublicProps) {
    const customClasses = useStyles();

    return (
        <Tooltip {...restProps}>
            <MuiIcon aria-label="info" className={classNames(customClasses.tooltipIcon, iconSize)}>
                {icon || <Info />}
            </MuiIcon>
        </Tooltip>
    );
}
