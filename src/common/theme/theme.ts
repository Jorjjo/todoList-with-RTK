import type { ThemeMode } from '@/app/app-slice';
import { createTheme } from '@mui/material/styles';

export const getTheme = (themeMode: ThemeMode) => {
    return createTheme({
        palette: {
            mode: themeMode,
            primary: {
                main: '#3f51b5',
            },
            secondary: {
                main: '#d81b60',
            },
        },
        components: {
            MuiIconButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&:hover': {
                            color: theme.palette.secondary.main,
                            backgroundColor: 'transparent',
                        },
                    }),
                },
            },
            MuiCheckbox: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&:hover': {
                            color: theme.palette.secondary.main,
                            backgroundColor: 'transparent',
                        },
                    }),
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&:hover': {
                            backgroundColor: 'transparent',
                            outline: `1px solid ${theme.palette.secondary.main}`,
                        },
                    }),
                },
            },
        },
    });
};
