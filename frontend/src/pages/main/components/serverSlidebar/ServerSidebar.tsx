// src/components/ServerSidebar/ServerSidebar.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import serverStore from '../../../../store/serverStore';
import './ServerSidebar.scss';
import ServerItem from './serverItem/ServerItem';
import ServerCreateModal from './serverCreateModal/ServerCreateModal';

const ServerSidebar: React.FC = observer(() => {
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        serverStore.fetchServers();
    }, []);

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
            <div className="settings-button" onClick={() => alert('Открыть настройки')}>
                ⚙️
            </div>
            <ServerCreateModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
              
            />
        </aside>
    );
});

export default ServerSidebar;
