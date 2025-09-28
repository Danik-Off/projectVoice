/* eslint-disable max-len */
import React from 'react';
import './MicButton.scss';
import MicIcon from '../../../../../../../../icons/Micro';
// Типы пропсов для компонента
interface MicButtonProps {
    isMicOn: boolean;
    onMicToggle: () => void;
}

const MicButton: React.FC<MicButtonProps> = ({ isMicOn, onMicToggle }) => {
    return (
        <button
            className={`mic-button ${isMicOn ? 'active' : 'inactive'}`}
            onClick={onMicToggle}
            aria-label={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
        >
            <MicIcon isMuted={!isMicOn}></MicIcon>
        </button>
    );
};

export default MicButton;
