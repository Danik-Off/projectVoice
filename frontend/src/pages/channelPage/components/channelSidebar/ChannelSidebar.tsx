// src/components/ChannelSidebar/ChannelSidebar.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import './ChannelSidebar.css';
import ChannelList from './components/channelList/ChannelList';
import UserControls from './components/userControls/UserControls';
import serverStore from '../../../../store/serverStore';
import ServerHeader from './components/serverHeader/ServerHeader';

const ChannelSidebar: React.FC = () => {
    const [textChannels, setTextChannels] = useState<string[]>([
        '# general',
        '# memes',
        '# gaming',
    ]);
    const [voiceChannels, setVoiceChannels] = useState<string[]>([
        '🔊 General',
        '🔊 Gaming',
    ]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [channelType, setChannelType] = useState<'text' | 'voice'>('text');

    const handleAddChannel = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (channelType === 'text') {
            setTextChannels([...textChannels, newChannelName]);
        } else {
            setVoiceChannels([...voiceChannels, newChannelName]);
        }
        setNewChannelName('');
        setModalOpen(false);
    };

    const handleEditServer = () => {
        // Implement server edit functionality
        alert(`Edit server: ${serverStore.currentServer?.name}`);
    };

    const currentServer = serverStore.currentServer;

    return (
        <aside className="channel-sidebar">
            {currentServer ? (
                <div>
                    <ServerHeader></ServerHeader>
                    <ChannelList />
                    <button
                        className="add-channel-button"
                        onClick={() => setModalOpen(true)}
                    >
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
