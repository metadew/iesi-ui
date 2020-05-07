import { makeStyles } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

export const useListStyles = makeStyles(({ palette, spacing, shape }) => ({
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
        background: palette.background.default,
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
        },
    },
}));
