import React from 'react';
import './VoiceRoom.css'; // стили для оформления комнаты
import voiceRoomStore from '../../../../store/roomStore';
import { observer } from 'mobx-react';
import { useUserProfile } from '../../../../components/UserProfileProvider';
import ClickableAvatar from '../../../../components/ClickableAvatar';

const VoiceRoom: React.FC = observer(() => {
    const { openProfile } = useUserProfile();
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
                                            {user.userData && (
                        <ClickableAvatar
                            user={{
                                id: user.userData.id,
                                username: user.userData.username,
                                email: `${user.userData.username}@temp.com`,
                                profilePicture: user.userData.profilePicture,
                                role: user.userData.role,
                                isActive: true,
                                createdAt: new Date().toISOString(),
                                status: 'online'
                            }}
                            size="medium"
                            onClick={() => {
                                if (user.userData) {
                                    openProfile({
                                        id: user.userData.id,
                                        username: user.userData.username,
                                        email: `${user.userData.username}@temp.com`,
                                        profilePicture: user.userData.profilePicture,
                                        role: user.userData.role,
                                        isActive: true,
                                        createdAt: new Date().toISOString(),
                                        status: 'online'
                                    }, false);
                                }
                            }}
                            className="user-avatar"
                        />
                    )}
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
