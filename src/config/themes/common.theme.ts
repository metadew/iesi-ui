import { ThemeOptions } from '@material-ui/core';

const commonTheme: ThemeOptions = {
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
        h6: {
            fontWeight: 700,
        },
    },
};

export default commonTheme;
