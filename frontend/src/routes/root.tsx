import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Feed from '../pages/feed/Feed';
import Profile from '../pages/profile/Profile';
import Message from '../pages/message/Message';
import Settings from '../pages/settings/Settings';
import Auth from '../pages/auth/Auth';

export const router = createBrowserRouter([
    {
        path: '/feed',
        element: <Feed />,
    },
    {
        path: '/profile',
        element: <Profile />,
    },
    {
        path: '/message',
        element: <Message />,
    },
    {
        path: '/settings',
        element: <Settings />,
    },
    {
        path: '/auth',
        element: <Auth />,
    },
]);
