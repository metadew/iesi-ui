import { createMuiTheme, ThemeOptions } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

const MUI_DEFAULT_THEME = createMuiTheme(); // https://material-ui.com/customization/default-theme
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
        success: {
            main: THEME_COLORS.SUCCESS,
        },
        warning: {
            main: THEME_COLORS.WARNING,
        },
        info: {
            main: THEME_COLORS.INFO,
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
            fontWeight: MUI_DEFAULT_THEME.typography.fontWeightBold,
        },
        h2: {
            fontSize: MUI_DEFAULT_THEME.typography.pxToRem(25),
            fontWeight: MUI_DEFAULT_THEME.typography.fontWeightBold,
        },
        h3: {
            fontSize: MUI_DEFAULT_THEME.typography.pxToRem(20),
            fontWeight: MUI_DEFAULT_THEME.typography.fontWeightBold,
        },
        h4: {
            fontSize: MUI_DEFAULT_THEME.typography.pxToRem(20),
            fontWeight: MUI_DEFAULT_THEME.typography.fontWeightBold,
            color: THEME_COLORS.PRIMARY,
        },
        h6: {
            fontWeight: MUI_DEFAULT_THEME.typography.fontWeightBold,
        },
        button: {
            fontWeight: MUI_DEFAULT_THEME.typography.fontWeightBold,
            fontSize: MUI_DEFAULT_THEME.typography.pxToRem(20),
            textTransform: 'none',
        },
        subtitle2: {
            fontWeight: MUI_DEFAULT_THEME.typography.fontWeightBold,
        },
    },
    overrides: {
        // Buttons
        MuiButton: {
            root: {
                padding: '.475em .912em',
            },
            containedSizeSmall: {
                fontSize: MUI_DEFAULT_THEME.typography.pxToRem(14),
            },
            containedSizeLarge: {
                fontSize: MUI_DEFAULT_THEME.typography.pxToRem(24),
            },
            iconSizeMedium: {
                fontSize: '1.2em',
                '& > *:first-child': {
                    fontSize: '1em',
                },
            },
            outlined: {
                padding: '.475em .912em',
            },
            outlinedSizeSmall: {
                fontSize: MUI_DEFAULT_THEME.typography.pxToRem(14),
            },
        },
        MuiIconButton: {
            sizeSmall: {
                padding: DEFAULT_SPACING,
            },
        },
        // Input labels
        MuiFormLabel: {
            root: {
                fontWeight: MUI_DEFAULT_THEME.typography.fontWeightBold,
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
                borderRadius: MUI_DEFAULT_THEME.shape.borderRadius,
            },
        },
        // Collapse
        MuiExpansionPanelSummary: {
            content: {
                margin: '0',

                '&$expanded': {
                    margin: '0',
                },
            },
            expandIcon: {
                marginRight: '0',
            },
        },

    },
};

export default commonTheme;
