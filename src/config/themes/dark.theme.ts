import { ThemeOptions } from '@material-ui/core';
import { grey, lightBlue } from '@material-ui/core/colors';

const darkTheme: ThemeOptions = {
    palette: {
        primary: {
            light: grey[50],
            main: lightBlue[400],
            dark: lightBlue[900],
            contrastText: grey[50],
        },
        type: 'dark',
    },
};

export default darkTheme;
