import React from 'react';
import './StatusBar.scss';
import voiceRoomStore from '../../../../../../../../store/roomStore';

const StatusBar: React.FC = () => {
    return (
        <div className="status-bar">
            <span className="status-bar__message">{voiceRoomStore.state}</span>
        </div>
    );
};

export default StatusBar;

