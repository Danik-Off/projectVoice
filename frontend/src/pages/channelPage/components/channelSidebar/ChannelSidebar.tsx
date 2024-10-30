// src/components/ChannelSidebar/ChannelSidebar.tsx
import React, { useState } from 'react';

import './ChannelSidebar.css';
import ChannelList from './components/channelList/ChannelList';
// import VoiceChannelList from './components/voiceChannelList/voiceChannelList';
import UserControls from './components/userControls/UserControls';

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

    return (
        <aside className="channel-sidebar">
            <div>
                <div className="channel-header">Server Name</div>

                <ChannelList channels={textChannels} />
                <button
                    className="add-channel-button"
                    onClick={() => setModalOpen(true)}
                >
                    + Add Channel
                </button>
            </div>
            <div>
                <UserControls />
            </div>
        </aside>
    );
};

export default ChannelSidebar;
