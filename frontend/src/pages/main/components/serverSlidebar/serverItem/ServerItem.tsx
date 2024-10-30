// src/components/ServerSidebar/ServerItem.tsx
import React from 'react';
import { Server } from '../../../../../types/server';

interface ServerItemProps {
    server: Server;
    onClick?: () => void;
}

const ServerItem: React.FC<ServerItemProps> = ({ server, onClick }) => {
    // Assuming server.icon is a URL or path to the icon
    const serverIcon = server.icon || ''; // Use server.icon if available
    const serverNameInitial = server.name.charAt(0).toUpperCase(); // Get the first letter of the server name

    return (
        <div className="server-icon" onClick={onClick}>
            {serverIcon ? (
                <img src={serverIcon} alt={`${server.name} icon`} className="server-icon-image" />
            ) : (
                <div className="server-icon-placeholder">{serverNameInitial}</div>
            )}
        </div>
    );
};

export default ServerItem;
