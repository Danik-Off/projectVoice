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
        <aside className="server-sidebar">
            <div className="add-button" onClick={onOpenModal}>
                +
            </div>
            <div className="server-sidebar__server-list">
                {serverStore.servers.map((server) => (
                    <ServerItem 
                        key={server.id} 
                        server={server} 
                        onClick={() => handleServerClick(server)}
                    />
                ))}
            </div>
            <div className="settings-button" onClick={handleSetting}>
                ⚙️
            </div>
            {authStore.user?.role === 'admin' && (
                <div className="admin-button" onClick={handleAdminPanel}>
                    👑
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
