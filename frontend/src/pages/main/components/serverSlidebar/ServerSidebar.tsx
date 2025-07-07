// src/components/ServerSidebar/ServerSidebar.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import serverStore from '../../../../store/serverStore';
import './ServerSidebar.scss';
import ServerItem from './serverItem/ServerItem';
import ServerCreateModal from './serverCreateModal/ServerCreateModal';
import { useNavigate } from 'react-router-dom';

const ServerSidebar: React.FC = observer(() => {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleSetting = () => {
        navigate(`/settings`);
    };
    useEffect(() => {
        serverStore.fetchServers();
    }, []);

    // Добавляем логирование для отладки
    console.log('ServerSidebar - servers count:', serverStore.servers.length);
    console.log('ServerSidebar - servers:', serverStore.servers);

    return (
        <aside className="server-sidebar">
            <div className="add-button" onClick={() => setModalOpen(true)}>
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
            <ServerCreateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </aside>
    );
});

export default ServerSidebar;
