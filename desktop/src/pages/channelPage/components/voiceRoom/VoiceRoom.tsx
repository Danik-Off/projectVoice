import React from 'react';
import './VoiceRoom.css'; // стили для оформления комнаты
import voiceRoomStore from '../../../../store/roomStore';
import { observer } from 'mobx-react';
import { useUserProfile } from '../../../../components/UserProfileProvider';
import ClickableAvatar from '../../../../components/ClickableAvatar';
import { authStore } from '../../../../store/authStore';

const VoiceRoom: React.FC = observer(() => {
    const { openProfile } = useUserProfile();
    const currentUser = authStore.user;
    const users = voiceRoomStore.participants;
    const isLocalSpeaking = voiceRoomStore.getLocalSpeakingState();
    const localVolumeLevel = voiceRoomStore.getLocalVolumeLevel();
    
    console.log("Участники голосовой комнаты:", users);
    console.log("Локальный пользователь говорит:", isLocalSpeaking, "Громкость:", localVolumeLevel);
    
    return (
        <div className="voice-room">
            <h2>Voice Room</h2>
            
            {/* Локальный пользователь */}
            {currentUser && (
                <div className={`user-box local-user ${isLocalSpeaking ? 'speaking' : ''}`}>
                    <ClickableAvatar
                        user={{
                            id: currentUser.id,
                            username: currentUser.username,
                            email: currentUser.email,
                            profilePicture: currentUser.profilePicture,
                            role: currentUser.role,
                            isActive: true,
                            createdAt: currentUser.createdAt,
                            status: 'online'
                        }}
                        size="medium"
                        onClick={() => openProfile(currentUser, true)}
                        className="user-avatar"
                    />
                    <div className="user-name">
                        {currentUser.username} (Вы)
                    </div>
                    <div className="user-status">
                        {isLocalSpeaking ? '🎤 Говорит' : '🔇 Молчит'}
                        {isLocalSpeaking && (
                            <div className="volume-indicator">
                                Громкость: {localVolumeLevel.toFixed(0)}%
                            </div>
                        )}
                    </div>
                </div>
            )}
            
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
                            {user.isSpeaking ? '🎤 Говорит' : (user.micToggle ? '🔇 Молчит' : '🔇 Выключен')}
                            {user.isSpeaking && (
                                <div className="volume-indicator">
                                    Громкость: {voiceRoomStore.getParticipantVolumeLevel(user.socketId).toFixed(0)}%
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default VoiceRoom;
