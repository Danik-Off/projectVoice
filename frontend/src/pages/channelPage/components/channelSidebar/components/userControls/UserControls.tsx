// src/components/ChannelSidebar/UserControls.tsx
import React, { useState } from 'react';
import './UserControls.css'; // Создайте этот CSS файл для стилей

const UserControls: React.FC = () => {
    const [isMicOn, setMicOn] = useState(true);
    const [volume, setVolume] = useState(100); // Громкость от 0 до 100

    const handleMicToggle = () => {
        setMicOn(!isMicOn);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(e.target.value));
    };

    return (
        <div className="user-controls">
            <div className="voice-control">
                <button
                    className={`mic-button ${isMicOn ? 'active' : 'inactive'}`}
                    onClick={handleMicToggle}
                >
                    {isMicOn ? '🎤' : '🔇'}
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
                    <span>{volume}</span>
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
