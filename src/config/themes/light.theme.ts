import { ThemeOptions, darken } from '@material-ui/core';
import { THEME_COLORS } from './colors';

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
        },
    },
};

export default lightTheme;
