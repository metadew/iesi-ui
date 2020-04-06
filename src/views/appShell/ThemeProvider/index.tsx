import React, { ReactNode, useState, Dispatch, useEffect } from 'react';
import {
    CssBaseline,
    Switch,
    FormControlLabel,
    useMediaQuery,
    createMuiTheme,
} from '@material-ui/core';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import localStorage from '@snipsonian/browser/es/storage/localStorage';
import {
    DEFAULT_THEME, THEME_STORAGE_KEY, THEMES, TThemeName, getThemeOptionsByName,
} from '../../../config/theme.config';

interface IThemeProvider {
    children: ReactNode;
}

function handleSwitchDarkMode({
    themeName,
    setThemeName,
}: {
    themeName: TThemeName;
    setThemeName: Dispatch<TThemeName>;
}) {
    const newTheme = themeName === THEMES.lightTheme ? THEMES.darkTheme : THEMES.lightTheme;
    setThemeName(newTheme);
    localStorage.save({ key: THEME_STORAGE_KEY, value: newTheme });
}

function ThemeProvider(props: IThemeProvider) {
    let currentTheme: TThemeName = DEFAULT_THEME;
    const [themeName, setThemeName] = useState<TThemeName>(currentTheme);

    const themeFromStorage = localStorage.read({ key: THEME_STORAGE_KEY }) as TThemeName;
    const hasPreferedTheme = typeof getThemeOptionsByName(themeFromStorage) !== 'undefined';
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    if (
        // Use prefered theme if already set in localstorage
        (hasPreferedTheme && themeFromStorage === THEMES.darkTheme)
        // or by system pref (MQ)
        || (!hasPreferedTheme && prefersDarkMode)
    ) {
        currentTheme = THEMES.darkTheme;
    }

    useEffect(() => {
        setThemeName(currentTheme);
    }, [currentTheme]);

    const currentThemeOptions = getThemeOptionsByName(themeName);

    return (
        <MuiThemeProvider theme={createMuiTheme(currentThemeOptions)}>
            <CssBaseline />
            {/* TODO: move theme switch */}
            <FormControlLabel
                control={(
                    <Switch
                        checked={themeName === THEMES.darkTheme}
                        onClick={() => handleSwitchDarkMode({ themeName, setThemeName })}
                        color="default"
                    />
                )}
                label="Toggle theme mode"
            />
            {props.children}
        </MuiThemeProvider>
    );
}

export default ThemeProvider;
