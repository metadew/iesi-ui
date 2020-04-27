import { ThemeOptions } from '@material-ui/core';

const commonTheme: ThemeOptions = {
    palette: {
        primary: {
            main: '#29ABE2',
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
    },
};

export default commonTheme;
