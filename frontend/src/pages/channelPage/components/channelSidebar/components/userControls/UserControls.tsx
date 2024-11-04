import React from 'react';
import './UserControls.scss';

import VoiceControl from './components/voiceControl/VoiceControl';
import UserInfo from './components/userInfo/UserInfo';
import StatusBar from './components/statusBar/StatusBar';

const UserControls: React.FC = () => {
    return (
        <div className="user-controls">
            <StatusBar />
            <VoiceControl />
            <UserInfo />
        </div>
    );
};

export default UserControls;
