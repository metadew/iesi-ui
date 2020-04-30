import { ThemeOptions } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';

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
        h6: {
            fontWeight: 700,
        },
        button: {
            // fontSize: '1.25rem',
            fontWeight: 700,
        },
    },
};

export default commonTheme;
