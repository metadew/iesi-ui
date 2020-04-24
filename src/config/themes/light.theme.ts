import { ThemeOptions } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const lightTheme: ThemeOptions = {
    palette: {
        primary: {
            light: grey[50],
            main: '#2699D5',
            dark: '#283240',
            contrastText: grey[50],
        },
        secondary: {
            light: grey[200],
            main: grey[300],
            dark: grey[400],
            contrastText: grey[900],
        },
        text: {
            primary: '#283240',
            secondary: '#283240',
        },
        type: 'light',
    },
};

export default lightTheme;
