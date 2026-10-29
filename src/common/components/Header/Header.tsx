import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { containerSx } from '@/common/styles';
import { getTheme } from '@/common/theme';
import { NavButton } from '@/common/components/NavButton/NavButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import {
    changeThemeModeAC,
    selectStatus,
    selectThemeMode,
} from '@/app/app-slice';
import { LinearProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { PATH } from '../Routing/routes/paths';
import { logoutTC, selectAuth } from '@/features/auth/model/auth-slice';

export const Header = () => {
    const themeMode = useAppSelector(selectThemeMode);
    const status = useAppSelector(selectStatus);
    const isLoggedIn = useAppSelector(selectAuth);

    const dispatch = useAppDispatch();

    const theme = getTheme(themeMode);

    const changeMode = () => {
        dispatch(
            changeThemeModeAC({
                themeMode: themeMode === 'light' ? 'dark' : 'light',
            }),
        );
    };

    const handleLogout = () => {
        dispatch(logoutTC());
    };

    return (
        <AppBar position='static' sx={{ mb: '30px' }} enableColorOnDark>
            <Toolbar>
                <Container maxWidth={'lg'} sx={containerSx}>
                    <IconButton color='inherit'>
                        <MenuIcon />
                    </IconButton>
                    <div>
                        {isLoggedIn ? (
                            <NavButton
                                variant='text'
                                color={'inherit'}
                                onClick={handleLogout}
                            >
                                Log out
                            </NavButton>
                        ) : (
                            <NavButton
                                component={RouterLink}
                                to={PATH.Login}
                                variant='text'
                                color={'inherit'}
                            >
                                Sign in
                            </NavButton>
                        )}

                        <NavButton
                            variant='text'
                            color={'inherit'}
                            size='small'
                        >
                            Faq
                        </NavButton>
                        <Switch color={'default'} onChange={changeMode} />
                    </div>
                </Container>
            </Toolbar>
            {status === 'loading' && <LinearProgress />}
        </AppBar>
    );
};
