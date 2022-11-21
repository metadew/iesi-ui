import { darken, fade, ThemeOptions } from '@material-ui/core';
import { THEME_COLORS } from './colors';

/* Keep in sync light.theme.ts !! */
const darkTheme: ThemeOptions = {
    palette: {
        text: {
            primary: THEME_COLORS.PRIMARY_LIGHT,
        },
        action: {
            active: THEME_COLORS.PRIMARY_LIGHT,
        },
        background: {
            default: THEME_COLORS.GREY_DARK,
        },
        type: 'dark',
    },
    overrides: {
        // Buttons
        MuiButton: {
            contained: {
                color: THEME_COLORS.PRIMARY_LIGHT,
                backgroundColor: THEME_COLORS.GREY_DARK,
                '&:hover': {
                    backgroundColor: darken(THEME_COLORS.GREY_DARK, 0.05),
                },
            },
            outlined: {
                borderColor: fade(THEME_COLORS.PRIMARY_LIGHT, 0.5),
            },
        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: THEME_COLORS.GREY_DARK,
            },
        },
        MuiFilledInput: {
            root: {
                backgroundColor: 'rgba(255, 255, 255, 0.09)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.13)',
                },
                '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 0.09)',
                },
            },
        },
    },
};

export default darkTheme;
