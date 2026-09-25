import { Main } from '@/app/Main';
import { Login } from '@/features/auth/ui/Login/Login';
import { Route, Routes } from 'react-router';
import { PageNotFound } from '../PageNotFound/PageNotFound';


export const PATH = {
    Main: '/',
    Login: 'login',
    NotFound: '*'
} as const;

export function Routing() {
    return (
        <Routes>
            <Route path={PATH.Main} element={<Main />} />
            <Route path={PATH.Login} element={<Login />} />
            <Route path={PATH.NotFound} element={<PageNotFound/>} />
        </Routes>
    );
}
