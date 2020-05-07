import { ThemeOptions, darken } from '@material-ui/core';
import { THEME_COLORS } from './colors';

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
        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: THEME_COLORS.GREY_DARK,
            },
        },
    },
};

export default darkTheme;
