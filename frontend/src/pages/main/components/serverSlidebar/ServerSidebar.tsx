// src/components/ServerSidebar/ServerSidebar.tsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import serverStore from '../../../../store/serverStore';
import { authStore } from '../../../../store/authStore';
import './ServerSidebar.scss';
import ServerItem from './serverItem/ServerItem';
import { useNavigate } from 'react-router-dom';

interface ServerSidebarProps {
    onOpenModal: () => void;
}

const ServerSidebar: React.FC<ServerSidebarProps> = observer(({ onOpenModal }) => {
    const navigate = useNavigate();

    const handleSetting = () => {
        navigate(`/settings`);
    };

    const handleAdminPanel = () => {
        navigate('/admin');
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
                    <ServerItem key={server.id} server={server} />
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
        </aside>
    );
});

export default ServerSidebar;
