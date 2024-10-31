// src/components/ChannelSidebar/TextChannel.tsx
import React from 'react';

interface TextChannelProps {
    name: string;
}

const TextChannel: React.FC<TextChannelProps> = ({ name }) => {
    return (
        <div className="text-channel">
            {name}
        </div>
    );
};

export default TextChannel;
