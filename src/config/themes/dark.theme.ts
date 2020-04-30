import { ThemeOptions } from '@material-ui/core';
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
};

export default darkTheme;
