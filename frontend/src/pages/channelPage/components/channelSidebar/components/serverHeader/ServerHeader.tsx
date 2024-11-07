// src/components/ChannelSidebar/ServerHeader.tsx
import React from 'react';
import { observer } from 'mobx-react-lite';
import './ServerHeader.scss';
import serverStore from '../../../../../../store/serverStore';
import PencilIcon from '../../../../../../icons/PencilIcon';

const ServerHeader: React.FC = () => {
    const currentServer = serverStore.currentServer;

    return (
        <div className="server-header">
            {currentServer ? (
                <>
                    <div className="server-info">
                        <span className="server-name">{currentServer.name}</span>
                    </div>
                    <button className="edit-button">
                        <PencilIcon width={16} height={16} color="currentColor" />
                    </button>
                </>
            ) : (
                <span className="no-server">No Server Selected</span>
            )}
        </div>
    );
};

export default observer(ServerHeader);
