import React from 'react';
import './VoiceControls.scss';

import VoiceControl from './components/voiceControl/VoiceControl';
import StatusBar from './components/statusBar/StatusBar';

const VoiceControls: React.FC = () => {
    return (
        <div className="voice-controls">
            <StatusBar />
            <VoiceControl />
        </div>
    );
};

export default VoiceControls;
