import { createBrowserRouter, RouteObject } from 'react-router';
import { PATH } from './paths';
import { Main } from '@/app/Main';
import { Login } from '@/features/auth/ui/Login/Login';
import { PageNotFound } from '../../PageNotFound/PageNotFound';
import { App } from '@/app/App';

const publicRoutes: RouteObject[] = [
    {
        path: PATH.Main,
        Component: Main,
    },
    {
        path: PATH.Login,
        Component: Login,
    },
    {
        path: PATH.NotFound,
        Component: PageNotFound,
    },
];

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: publicRoutes,
    },
]);
