import { createBrowserRouter } from 'react-router-dom';

import Settings from '../pages/settings/Settings';
import Auth from '../pages/auth/Auth';
import ProtectedRoute from '../store/ProtectedRoute';
import Layout from '../pages/main/Main';
import ChannelPage from '../pages/channelPage/ChannelPage';
import WelcomePage from '../pages/welcomePage/WelcomePage';
import VoiceRoom from '../pages/channelPage/components/voiceRoom/VoiceRoom';
import MessageList from '../pages/channelPage/components/messageList/MessageList';
import AdminPanel from '../pages/admin/AdminPanel';
import AdminRoute from '../store/AdminRoute';
import ServerSettings from '../pages/serverSettings/ServerSettings';
import InvitePage from '../pages/invite/InvitePage';
import ProfileDemo from '../components/ProfileDemo';

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
                path: 'server/:serverId/settings',
                element: <ServerSettings />,
            },
            {
                path: 'settings',
                element: <Settings />,
            },
            {
                path: 'profile-demo',
                element: <ProfileDemo />,
            },
            {
                path: 'admin',
                element: (
                    <AdminRoute>
                        <AdminPanel />
                    </AdminRoute>
                ),
            },
        ],
    },
    {
        path: '/auth',
        element: <Auth />, // Public route
    },
    {
        path: '/invite/:token',
        element: <InvitePage />, // Public route for invites
    },
]);
