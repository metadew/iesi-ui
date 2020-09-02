import React from 'react';
import classNames from 'classnames';
import {
    Tooltip as MuiTooltip,
    TooltipProps,
    makeStyles,
} from '@material-ui/core';

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

const useStyles = makeStyles(({ typography }) => ({
    tooltipContent: {
        fontSize: typography.pxToRem(12),
    },
    tooltipContentString: {
        fontWeight: typography.fontWeightBold,
    },
}));

export default function Tooltip({
    children,
    title,
    interactive = true,
    ...restProps
}: TooltipProps) {
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
            {children}
        </MuiTooltip>
    );
}
