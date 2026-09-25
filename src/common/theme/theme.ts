import type { ThemeMode } from '@/app/app-slice';
import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

export const getTheme = (themeMode: ThemeMode) => {
    return createTheme({
        palette: {
            mode: themeMode,
            primary: {
                main: '#3f51b5',
                light: '#ffff'
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
                            outline: `2px solid ${theme.palette.secondary.main}`,
                            border: '0'
                        },
                    }),
                },
            },
        },
    });
};
