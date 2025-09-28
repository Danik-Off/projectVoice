import React, { useState } from 'react';
import MicButton from '../micButton/MicButton';
import VolumeControl from '../volumeControl/VolumeControl';
import voiceRoomStore from '../../../../../../../../store/roomStore';
import './VoiceControl.scss';

const VoiceControl: React.FC = () => {
    const [isMicOn, setMicOn] = useState<boolean>(true);

    const [volumeMic, setVolumeMic] = useState<number>(100);

    const handleMicToggle = (): void => {
        setMicOn(!isMicOn);
        isMicOn ? voiceRoomStore.muteMicrophone() : voiceRoomStore.unmuteMicrophone();
    };
    const handleVolumeChange = (newVolume: number): void => {
        setVolumeMic(newVolume);
        //TODO реализовать регулировку громкости микрофона
    };
    return (
        <div className="voice-control">
            <MicButton isMicOn={isMicOn} onMicToggle={handleMicToggle} />
            <VolumeControl volume={volumeMic} onVolumeChange={handleVolumeChange} />
        </div>
    );
};

export default VoiceControl;
