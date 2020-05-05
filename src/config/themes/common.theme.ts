import { ThemeOptions } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

const DEFAULT_SPACING = 10;

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
        error: {
            main: THEME_COLORS.ERROR,
        },
    },
    spacing: DEFAULT_SPACING,
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
        // Buttons
        MuiButton: {
            root: {
                padding: '.475em .912em',
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
        // Input labels
        MuiFormLabel: {
            root: {
                fontWeight: 'bold',
            },
        },
        // Inputs
        MuiFormControl: {
            marginNormal: {
                marginTop: `${DEFAULT_SPACING * 2}px`,
                marginBottom: `${DEFAULT_SPACING * 1}px`,
            },
            marginDense: {
                marginTop: `${DEFAULT_SPACING * 1}px`,
                marginBottom: `${DEFAULT_SPACING * 0.5}px`,
            },
        },
        MuiFilledInput: {
            root: {
                borderRadius: '4px',
            },
        },
    },
};

export default commonTheme;
