import { createBrowserRouter } from 'react-router-dom';
import Feed from '../pages/feed/Feed';
import Profile from '../pages/profile/Profile';
import Message from '../pages/message/Message';
import Settings from '../pages/settings/Settings';
import Auth from '../pages/auth/Auth';
import ProtectedRoute from '../store/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/feed',
        element: (
            <ProtectedRoute>
                <Feed />
            </ProtectedRoute>
        ),
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
    },
    {
        path: '/message',
        element: (
            <ProtectedRoute>
                <Message />
            </ProtectedRoute>
        ),
    },
    {
        path: '/settings',
        element: (
            <ProtectedRoute>
                <Settings />
            </ProtectedRoute>
        ),
    },
    {
        path: '/auth',
        element: <Auth />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Feed />
            </ProtectedRoute>
        ),
    },
]);
