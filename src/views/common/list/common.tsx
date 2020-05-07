import { makeStyles, lighten, darken } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

export const useListStyles = makeStyles(({ palette, spacing, shape, transitions, typography }) => ({
    tableContainer: {
        background: palette.background.default,
        transitionProperty: 'background-color',
        transitionTimingFunction: transitions.easing.sharp,
        transitionDuration: `${transitions.duration.leavingScreen}ms`,
    },
    tableContainerIsDragging: {
        background: darken(palette.background.default, 0.05),
    },
    table: {
        // Padding for box shadows of tableRows
        paddingTop: spacing(2.2),
        paddingBottom: spacing(2.2),
        paddingLeft: spacing(5),
        paddingRight: spacing(5),
        minWidth: 650,
        tableLayout: 'auto',
        borderCollapse: 'separate',
        borderSpacing: `0 ${spacing(1)}px`,
        '& .MuiTableCell-root': {
            position: 'relative',
            padding: `${spacing(1.1)}px ${spacing(3)}px`,
            borderBottomWidth: 0,
            '&:after': {
                content: '" "',
                position: 'absolute',
                top: spacing(1.5),
                bottom: spacing(1.5),
                right: 0,
                width: '1px',
                backgroundColor: THEME_COLORS.GREY,
            },
            '&:first-child': {
                borderTopLeftRadius: shape.borderRadius,
                borderBottomLeftRadius: shape.borderRadius,
            },
            '&:last-child': {
                borderTopRightRadius: shape.borderRadius,
                borderBottomRightRadius: shape.borderRadius,
                '&:after': {
                    display: 'none',
                },
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
                '&:after': {
                    display: 'none',
                },
            },
        },
    },
}));
