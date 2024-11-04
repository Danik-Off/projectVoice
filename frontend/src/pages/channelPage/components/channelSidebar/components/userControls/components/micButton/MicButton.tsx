import React from 'react';

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
            {isMicOn ? '🎙️' : '❌'}
        </button>
    );
};

export default MicButton;
