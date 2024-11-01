// src/components/ChannelSidebar/ChannelSidebar.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';

import './ChannelSidebar.css';
import ChannelList from './components/channelList/ChannelList';
import UserControls from './components/userControls/UserControls';
import serverStore from '../../../../store/serverStore';
import ServerHeader from './components/serverHeader/ServerHeader';

const ChannelSidebar: React.FC = () => {
    const currentServer = serverStore.currentServer;

    return (
        <aside className="channel-sidebar">
            {currentServer ? (
                <div>
                    <ServerHeader></ServerHeader>
                    <ChannelList />
                    <button className="add-channel-button">
                        + Add Channel
                    </button>
                </div>
            ) : (
                <div className="channel-header">No Server Selected</div>
            )}
            <UserControls />
        </aside>
    );
};

export default observer(ChannelSidebar);
