import { createBrowserRouter } from 'react-router-dom';

import Feed from '../pages/feed/Feed';
import Profile from '../pages/profile/Profile';
import Message from '../pages/message/Message';
import Settings from '../pages/settings/Settings';
import Auth from '../pages/auth/Auth';
import ProtectedRoute from '../store/ProtectedRoute';
import Layout from '../pages/main/Main';

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
                path: 'feed',
                element: <Feed />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'message',
                element: <Message />,
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
