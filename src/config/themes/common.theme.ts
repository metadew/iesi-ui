import { ThemeOptions } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';
import { darken } from '@material-ui/core/styles/colorManipulator';

const commonTheme: ThemeOptions = {
    palette: {
        primary: {
            main: THEME_COLORS.PRIMARY,
            contrastText: THEME_COLORS.WHITE,
        },
        secondary: {
            main: THEME_COLORS.SECONDARY,
            contrastText: THEME_COLORS.WHITE,
        },
    },
    spacing: 10,
    typography: {
        fontFamily: [
            'Open Sans',
            'Helvetica',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontSize: '1.5625rem',
            fontWeight: 700,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 700,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 400,
            color: THEME_COLORS.PRIMARY,
        },
        h6: {
            fontWeight: 700,
        },
        button: {
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1.25rem',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                padding: '.475em .912em',
            },
            contained: {
                color: THEME_COLORS.PRIMARY_DARK,
                backgroundColor: THEME_COLORS.GREY,
                '&:hover': {
                    backgroundColor: darken(THEME_COLORS.GREY, 0.1),
                },
            },
            containedSizeSmall: {
                fontSize: '.875rem',
            },
            containedSizeLarge: {
                fontSize: '1.5rem',
            },
            iconSizeMedium: {
                fontSize: '1.2em',
                '& > *:first-child': {
                    fontSize: '1em',
                },
            },
        },
    },
};

export default commonTheme;
