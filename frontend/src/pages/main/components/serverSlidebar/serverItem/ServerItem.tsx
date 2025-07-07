import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Server } from '../../../../../types/server';
import './ServerItem.scss';

interface ServerItemProps {
    server: Server;
}

const ServerItem: React.FC<ServerItemProps> = ({ server }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const serverIcon = server.icon || '';
    const serverNameInitial = server.name.charAt(0).toUpperCase();
    
    // Проверяем, является ли текущий сервер активным
    const isActive = location.pathname.includes(`/server/${server.id}`);

    const handleNavigate = () => {
        navigate(`/server/${server.id}`);
    };

    return (
        <div className={`server-item ${isActive ? 'active' : ''}`} onClick={handleNavigate}>
            {serverIcon ? (
                <img src={serverIcon} alt={`${server.name} icon`} className="server-icon" />
            ) : (
                <div className="server-icon-placeholder">{serverNameInitial}</div>
            )}
            {isActive && (
                <div className="active-indicator">
                    <div className="indicator-dot"></div>
                </div>
            )}
        </div>
    );
};

export default ServerItem;
