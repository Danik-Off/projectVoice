import { createBrowserRouter } from 'react-router-dom';

import Settings from '../pages/settings/Settings';
import Auth from '../pages/auth/Auth';
import ProtectedRoute from '../store/ProtectedRoute';
import Layout from '../pages/main/Main';
import ChannelPage from '../pages/channelPage/ChannelPage';
import WelcomePage from '../pages/welcomePage/WelcomePage';
import VoiceRoom from '../pages/channelPage/components/voiceRoom/VoiceRoom';
import MessageList from '../pages/channelPage/components/messageList/MessageList';

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
                path: 'server/:serverId',
                element: <ChannelPage />,
                children: [
                    {
                        path: 'voiceRoom/:roomId',
                        element: <VoiceRoom />,
                    },
                    {
                        path: 'textRoom/:roomId',
                        element: <MessageList />,
                    },
                ],
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
