import { createBrowserRouter } from 'react-router-dom';

import Settings from '../pages/settings/Settings';
import Auth from '../pages/auth/Auth';
import ProtectedRoute from '../store/ProtectedRoute';
import Layout from '../pages/main/Main';
import ChannelPage from '../pages/channelPage/ChannelPage';
import WelcomePage from '../pages/welcomePage/WelcomePage';


export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '/',
                element: <WelcomePage />,
            },
            {
                path: 'server/:id',
                element: <ChannelPage />,
            },
            {
                path: 'settings',
                element: <Settings />,
            },
        ],
    },
    {
        path: '/auth',
        element: <Auth />, // Public route
    },
]);
