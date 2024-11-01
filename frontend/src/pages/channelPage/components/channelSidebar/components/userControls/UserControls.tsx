import React, { useEffect, useState } from 'react';
import './UserControls.css';
import { socketClient } from '../channelList/ChannelList';
import { stateMessages } from '../../../../../../types/socket.types';

const UserControls: React.FC = () => {
    const [isMicOn, setMicOn] = useState(true);
    const [volume, setVolume] = useState(100);
    const [socketState, setSocketState] = useState(socketClient.state);

    useEffect(() => {
        const updateState = () => {
            setSocketState(socketClient.state);
        };

        socketClient.onStateChange = updateState;

        return () => {
            socketClient.onStateChange = null;
        };
    }, []);

    const handleMicToggle = () => {
        setMicOn(!isMicOn);
        isMicOn
            ? socketClient.muteMicrophone()
            : socketClient.unmuteMicrophone();
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(e.target.value));
    };

    return (
        <div className="user-controls">
            {/* Status Bar */}
            <div className="status-bar">
                <span className="status-message">
                    {stateMessages[socketState]}
                </span>
            </div>

            <div className="voice-control">
                <button
                    className={`mic-button ${isMicOn ? 'active' : 'inactive'}`}
                    onClick={handleMicToggle}
                >
                    {`${isMicOn ? '🎙️' : '❌'}`}
                </button>
                <div className="volume-control">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                    />
                    <span className="volume-label">{volume}</span>
                </div>
            </div>
            <div className="user-info">
                <img
                    className="avatar"
                    src="avatar-placeholder.png"
                    alt="User Avatar"
                />
                <div className="username">Username</div>
                <button className="settings-button">⚙️</button>
            </div>
        </div>
    );
};

export default UserControls;
