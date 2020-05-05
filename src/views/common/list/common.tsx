import { makeStyles } from '@material-ui/core';

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
            borderBottomWidth: 0,
            '&:first-child': {
                borderTopLeftRadius: shape.borderRadius,
                borderBottomLeftRadius: shape.borderRadius,
            },
            '&:last-child': {
                borderTopRightRadius: shape.borderRadius,
                borderBottomRightRadius: shape.borderRadius,
            },
        },
    },
}));
