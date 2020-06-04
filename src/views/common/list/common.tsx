import { makeStyles, lighten, darken } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

export const useListStyles = makeStyles(({ breakpoints, palette, spacing, shape, transitions, typography }) => ({
    tableContainer: {
        background: 'transparent',
        transitionProperty: 'background',
        transitionTimingFunction: transitions.easing.sharp,
        transitionDuration: `${transitions.duration.leavingScreen}ms`,
    },
    tableContainerIsDragging: {
        background: darken(palette.background.default, 0.05),
    },
    table: {
        // Padding for box shadows of tableRows
        padding: `${spacing(1.2)}px ${spacing(2.2)}px`,
        minWidth: 650,
        height: '1px', // https://stackoverflow.com/a/56913789
        tableLayout: 'auto',
        borderCollapse: 'separate',
        borderSpacing: `0 ${spacing(1)}px`,
        '& .MuiTableCell-root': {
            position: 'relative',
            padding: `${spacing(1)}px ${spacing(1.5)}px`,
            borderBottomWidth: 0,
            '&:before': {
                content: '" "',
                position: 'absolute',
                top: spacing(1.5),
                bottom: spacing(1.5),
                left: 0,
                width: '1px',
                backgroundColor: THEME_COLORS.GREY,
            },
            '&:first-child': {
                borderTopLeftRadius: shape.borderRadius,
                borderBottomLeftRadius: shape.borderRadius,
                '&:before': {
                    content: 'normal',
                },
            },
            '&:last-child': {
                borderTopRightRadius: shape.borderRadius,
                borderBottomRightRadius: shape.borderRadius,
            },
            '&.drag-handle': {
                padding: `${spacing(1)}px ${spacing(0.6)}px`,
                backgroundColor:
                    palette.type === 'light'
                        ? palette.background.default
                        : lighten(THEME_COLORS.GREY_DARK, 0.025),
                color: THEME_COLORS.GREY,
                fontSize: typography.pxToRem(34),
                lineHeight: 0,
                '& + .MuiTableCell-root:before': {
                    display: 'none',
                },
            },
            [breakpoints.up('md')]: {
                padding: `${spacing(1.5)}px ${spacing(2)}px`,
            },
        },
    },
}));
