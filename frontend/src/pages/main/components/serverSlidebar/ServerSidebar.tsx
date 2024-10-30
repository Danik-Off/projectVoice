// src/components/ServerSidebar/ServerSidebar.tsx
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import serverStore from '../../../../store/serverStore';
import './ServerSidebar.css';
import ServerItem from './serverItem/ServerItem';
import ServerCreateModal from './serverCreateModal/ServerCreateModal';

const ServerSidebar: React.FC = observer(() => {
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        serverStore.fetchServers();
    }, []);

    return (
        <aside className="server-sidebar">
            <div className="server-icon" onClick={() => setModalOpen(true)}>
                +
            </div>
            {serverStore.servers.map((server) => (
                <ServerItem key={server.id} server={server} />
            ))}
            <ServerCreateModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={async (name: string) => {
                    await serverStore.createServer({ name });
                }}
            />
        </aside>
    );
});

export default ServerSidebar;
