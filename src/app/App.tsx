import { ErrorSnackbar } from '@/common/components/ErrorToast';
import { Header } from '@/common/components/Header/Header';
import { useAppSelector } from '@/common/hooks';
import { getTheme } from '@/common/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { selectThemeMode } from './app-slice';
import './App.css';
import { Routing } from '@/common/components';

export const App = () => {
    const themeMode = useAppSelector(selectThemeMode);

    const theme = getTheme(themeMode);

    return (
        <ThemeProvider theme={theme}>
            <div className={'app'}>
                <CssBaseline />
                <Header />
                <Routing />
                <ErrorSnackbar />
            </div>
        </ThemeProvider>
    );
};
