// src/components/ChannelSidebar/ChannelList.tsx
import React, { useState } from 'react';
import TextChannel from './components/textChannel/TextChannel';
import VoiceChannel from './components/voiceChannel/VoiceChannel';

const ChannelList: React.FC = () => {
    // Internal state for text and voice channels
    const [textChannels, setTextChannels] = useState<string[]>([
        '# general',
        '# memes',
        '# gaming',
    ]);
    const [voiceChannels, setVoiceChannels] = useState<string[]>([
        '🔊 General',
        '🔊 Gaming',
    ]);

    return (
        <div className="channel-list">
            <h3>Text Channels</h3>
            {textChannels.map((channel, index) => (
                <TextChannel key={index} name={channel} />
            ))}
            <h3>Voice Channels</h3>
            {voiceChannels.map((channel, index) => (
                <VoiceChannel key={index} name={channel} />
            ))}
        </div>
    );
};

export default ChannelList;
