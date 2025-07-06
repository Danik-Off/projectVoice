import React from 'react';
import './VoiceRoom.css'; // стили для оформления комнаты
import voiceRoomStore from '../../../../store/roomStore';
import { observer } from 'mobx-react';

const VoiceRoom: React.FC = observer(() => {
    // const users = [
    //     { id: '1', name: 'Alice', isSpeaking: false },
    //     { id: '2', name: 'Bob', isSpeaking: true },
    //     { id: '3', name: 'Charlie', isSpeaking: false },
    // ];
    const users = voiceRoomStore.participants;
    console.log("Участники голосовой комнаты:", users);
    
    return (
        <div className="voice-room">
            <h2>Voice Room</h2>
            <div className="user-list">
                {users.map((user) => (
                    <div
                        key={user.socketId}
                        className={`user-box ${
                            user.isSpeaking ? 'speaking' : ''
                        }`}
                    >
                        <div className="user-avatar">
                            {user.userData?.profilePicture ? (
                                <img 
                                    src={user.userData.profilePicture} 
                                    alt={user.userData.username}
                                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                                />
                            ) : (
                                <span>{user.userData?.username?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <div className="user-name">
                            {user.userData?.username || 'Unknown User'}
                        </div>
                        <div className="user-status">
                            {user.micToggle ? '🎤' : '🔇'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default VoiceRoom;
