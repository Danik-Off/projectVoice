// src/components/ServerSidebar/ServerItem.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Server } from '../../../../../types/server';

interface ServerItemProps {
    server: Server;
}

const ServerItem: React.FC<ServerItemProps> = ({ server }) => {
    const navigate = useNavigate();
    const serverIcon = server.icon || '';
    const serverNameInitial = server.name.charAt(0).toUpperCase();

    const handleNavigate = () => {
        navigate(`/server/${server.id}`);
    };

    return (
        <div className="server-icon" onClick={handleNavigate}>
            {serverIcon ? (
                <img src={serverIcon} alt={`${server.name} icon`} className="server-icon-image" />
            ) : (
                <div className="server-icon-placeholder">{serverNameInitial}</div>
            )}
        </div>
    );
};

export default ServerItem;
