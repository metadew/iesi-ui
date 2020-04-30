import { ThemeOptions } from '@material-ui/core';
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
            default: THEME_COLORS.GREY_LIGHT,
        },
        type: 'light',
    },
};

export default lightTheme;
