// src/components/ChannelSidebar/ChannelSidebar.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';

import './ChannelSidebar.scss';
import ChannelList from './components/channelList/ChannelList';
import serverStore from '../../../../store/serverStore';
import ServerHeader from './components/serverHeader/ServerHeader';

const ChannelSidebar: React.FC = () => {
    const currentServer = serverStore.currentServer;

    return (
        <aside className="channel-sidebar">
            {currentServer ? (
                <div>
                    <ServerHeader />
                    <ChannelList />
                </div>
            ) : (
                <div className="no-server-message">
                    Выберите сервер для начала работы
                </div>
            )}
        </aside>
    );
};

export default observer(ChannelSidebar);
