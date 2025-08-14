import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Server } from '../../../../../types/server';
import './ServerItem.scss';

interface ServerItemProps {
    server: Server;
    onClick?: () => void;
}

const ServerItem: React.FC<ServerItemProps> = ({ server, onClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const serverIcon = server.icon || '';
    const serverNameInitial = server.name.charAt(0).toUpperCase();
    
    // Проверяем, является ли текущий сервер активным
    const isActive = location.pathname.includes(`/server/${server.id}`);

    // Определяем классы для различных состояний сервера
    const getServerClasses = () => {
        const baseClasses = ['server'];
        
        if (isActive) baseClasses.push('active');
        if (server.isBlocked) baseClasses.push('blocked');
        if (server.hasNotifications) baseClasses.push('has-notifications');
        if (server.connectionError) baseClasses.push('connection-error');
        if (server.maintenance) baseClasses.push('maintenance');
        
        // Добавляем специальные классы для VoiceVerse дизайна
        if (server.isBlocked) baseClasses.push('animate-pulse');
        if (server.connectionError) baseClasses.push('animate-shake');
        if (server.maintenance) baseClasses.push('animate-rotate');
        
        return baseClasses.join(' ');
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/server/${server.id}`);
        }
    };

    // Определяем стили для иконки в зависимости от состояния
    const getIconStyles = () => {
        if (server.isBlocked) {
            return { filter: 'grayscale(0.5) brightness(0.7)' };
        }
        if (server.connectionError) {
            return { filter: 'brightness(0.8)' };
        }
        if (server.maintenance) {
            return { filter: 'brightness(0.9)' };
        }
        return {};
    };

    return (
        <div 
            className={getServerClasses()} 
            onClick={handleClick}
            title={server.name}
            data-server-id={server.id}
        >
            {serverIcon ? (
                <img 
                    src={serverIcon} 
                    alt={`${server.name} icon`} 
                    className="server-icon" 
                    style={getIconStyles()}
                />
            ) : (
                <div 
                    className="server-icon"
                    style={getIconStyles()}
                >
                    {serverNameInitial}
                </div>
            )}
            
            {/* Индикатор состояния сервера */}
            {server.isBlocked && (
                <div className="server-status-indicator blocked">
                    🚫
                </div>
            )}
            
            {server.connectionError && !server.isBlocked && (
                <div className="server-status-indicator error">
                    ⚠️
                </div>
            )}
            
            {server.maintenance && !server.isBlocked && !server.connectionError && (
                <div className="server-status-indicator maintenance">
                    🔧
                </div>
            )}
            
            {/* Счетчик уведомлений */}
            {server.notificationCount && server.notificationCount > 0 && (
                <div className="notification-badge">
                    {server.notificationCount > 99 ? '99+' : server.notificationCount}
                </div>
            )}
        </div>
    );
};

export default ServerItem;
