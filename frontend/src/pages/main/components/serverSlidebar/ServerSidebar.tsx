// src/components/ServerSidebar/ServerSidebar.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import serverStore from '../../../../store/serverStore';
import { authStore } from '../../../../store/authStore';
import BlockedServerModal from '../../../../components/BlockedServerModal';
import './ServerSidebar.scss';
import ServerItem from './serverItem/ServerItem';
import { useNavigate } from 'react-router-dom';

interface ServerSidebarProps {
    onOpenModal: () => void;
}

const ServerSidebar: React.FC<ServerSidebarProps> = observer(({ onOpenModal }) => {
    const navigate = useNavigate();
    const [blockedServer, setBlockedServer] = useState<{
        name: string;
        reason?: string;
        blockedAt?: string;
        blockedBy?: string;
    } | null>(null);

    const handleSetting = () => {
        navigate(`/settings`);
    };

    const handleAdminPanel = () => {
        navigate('/admin');
    };

    const handleServerClick = (server: any) => {
        if (server.isBlocked) {
            setBlockedServer({
                name: server.name,
                reason: server.blockReason,
                blockedAt: server.blockedAt,
                blockedBy: server.blockedByUser?.username
            });
        } else {
            //  открыть сервер
            navigate(`/server/${server.id}`);
        }
    };
    
    useEffect(() => {
        serverStore.fetchServers();
    }, []);

    // Добавляем логирование для отладки
    console.log('ServerSidebar - servers count:', serverStore.servers.length);
    console.log('ServerSidebar - servers:', serverStore.servers);

    return (
        <aside className="servers">
            {/* Домашний сервер */}
            <div className="server home active" onClick={() => navigate('/')}>
                <div className="server-icon">🏠</div>
            </div>
            
            {/* Разделитель */}
            <div className="server-separator"></div>
            
            {/* Список серверов */}
            {serverStore.servers.map((server) => (
                <ServerItem 
                    key={server.id} 
                    server={server} 
                    onClick={() => handleServerClick(server)}
                />
            ))}
            
            {/* Разделитель перед кнопками */}
            <div className="server-separator"></div>
            
            {/* Кнопка добавления сервера */}
            <div className="server add" onClick={onOpenModal}>
                <div className="server-icon">+</div>
            </div>
            
            {/* Кнопка настроек */}
            <div className="server settings" onClick={handleSetting}>
                <div className="server-icon">⚙️</div>
            </div>
            
            {/* Кнопка админ панели */}
            {authStore.user?.role === 'admin' && (
                <div className="server admin" onClick={handleAdminPanel}>
                    <div className="server-icon">👑</div>
                </div>
            )}

            {/* Модальное окно заблокированного сервера */}
            <BlockedServerModal
                isOpen={!!blockedServer}
                onClose={() => setBlockedServer(null)}
                serverName={blockedServer?.name || ''}
                reason={blockedServer?.reason}
                blockedAt={blockedServer?.blockedAt}
                blockedBy={blockedServer?.blockedBy}
            />
        </aside>
    );
});

export default ServerSidebar;
