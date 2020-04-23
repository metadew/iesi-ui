import { ThemeOptions } from '@material-ui/core';
import { lightBlue, grey } from '@material-ui/core/colors';

const lightTheme: ThemeOptions = {
    palette: {
        primary: {
            light: grey[50],
            main: lightBlue[400],
            dark: lightBlue[900],
            contrastText: grey[50],
        },
        type: 'light',
    },
};

export default lightTheme;
