// src/components/ChannelSidebar/ChannelList.tsx
import React from 'react';

interface ChannelListProps {
    channels: string[];
}

const ChannelList: React.FC<ChannelListProps> = ({ channels }) => {
    return (
        <div className="channel-list">
            {channels.map((channel, index) => (
                <div key={index} className="channel">
                    {channel}
                </div>
            ))}
        </div>
    );
};

export default ChannelList;
