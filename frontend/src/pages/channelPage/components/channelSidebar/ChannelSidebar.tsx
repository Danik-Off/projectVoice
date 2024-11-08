// src/components/ChannelSidebar/ChannelSidebar.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';

import './ChannelSidebar.scss';
import ChannelList from './components/channelList/ChannelList';
import serverStore from '../../../../store/serverStore';
import ServerHeader from './components/serverHeader/ServerHeader';
import VoiceControls from './components/voiceControls/VoiceControls';

const ChannelSidebar: React.FC = () => {
    const currentServer = serverStore.currentServer;

    return (
        <aside className="channel-sidebar">
            {currentServer ? (
                <div>
                    <ServerHeader></ServerHeader>
                    <ChannelList />
                </div>
            ) : (
                <>a</>
            )}
            <VoiceControls />
        </aside>
    );
};

export default observer(ChannelSidebar);
