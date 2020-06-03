import { ThemeOptions, darken, fade } from '@material-ui/core';
import { THEME_COLORS } from './colors';

/* Keep in sync dark.theme.ts !! */
const lightTheme: ThemeOptions = {
    palette: {
        text: {
            primary: THEME_COLORS.PRIMARY_DARK,
        },
        action: {
            active: THEME_COLORS.PRIMARY_DARK,
        },
        background: {
            default: THEME_COLORS.GREY_LIGHTER,
        },
        type: 'light',
    },
    overrides: {
        // Buttons
        MuiButton: {
            contained: {
                color: THEME_COLORS.PRIMARY_DARK,
                backgroundColor: THEME_COLORS.GREY_LIGHT,
                '&:hover': {
                    backgroundColor: darken(THEME_COLORS.GREY_LIGHT, 0.1),
                },
            },
            outlined: {
                borderColor: fade(THEME_COLORS.PRIMARY_DARK, 0.5),
            },
        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: THEME_COLORS.GREY_LIGHT,
            },
        },
        MuiFilledInput: {
            root: {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.07)',
                },
                '&.Mui-focused': {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                },
            },
        },
    },
};

export default lightTheme;
