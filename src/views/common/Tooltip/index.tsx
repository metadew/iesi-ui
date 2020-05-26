import React from 'react';
import classNames from 'classnames';
import {
    Tooltip as MuiTooltip,
    TooltipProps,
    Icon as MuiIcon,
    makeStyles,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';

interface IPublicProps extends Omit<TooltipProps, 'children'> {
    icon?: React.ReactNode;
    iconSize?: 'inherit' | 'default' | 'small';
}

const useTooltipStyles = makeStyles(({ palette, spacing, typography }) => ({
    // Theme specific adjustments in src/config/themes/*.theme.ts
    tooltip: {
        padding: `${spacing(1)}px ${spacing(3)}px`,
        color: palette.text.primary,
        boxShadow: '0 2px 22px rgba(0, 0, 0, .10)',
        '&.default': {
            fontSize: typography.pxToRem(16),
        },
        '&.small': {
            fontSize: typography.pxToRem(14),
        },
        '&.inherit': {
            fontSize: 'inherit',
        },
    },
}));

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
    tooltipContent: {
        fontSize: typography.pxToRem(12),
    },
    tooltipContentString: {
        fontWeight: typography.fontWeightBold,
    },
}));

export default function Tooltip({
    iconSize = 'default',
    icon,
    title,
    interactive = true,
    ...restProps
}: IPublicProps) {
    const toolTipClasses = useTooltipStyles();
    const customClasses = useStyles();

    return (
        <MuiTooltip
            classes={toolTipClasses}
            interactive={interactive}
            title={(
                <div
                    className={classNames(customClasses.tooltipContent, {
                        [customClasses.tooltipContentString]: typeof title === 'string',
                    })}
                >
                    {title}
                </div>
            )}
            {...restProps}
        >
            <MuiIcon aria-label="info" className={classNames(customClasses.tooltipIcon, iconSize)}>
                {icon || <Info />}
            </MuiIcon>
        </MuiTooltip>
    );
}
