import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import './VoiceControls.scss';
import voiceRoomStore from '../../../../../../store/roomStore';
import { authStore } from '../../../../../../store/authStore';
import notificationStore from '../../../../../../store/NotificationStore';

const VoiceControls: React.FC = observer(() => {
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isDeafened, setIsDeafened] = useState<boolean>(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

    const currentUser = authStore.user;
    const currentVoiceChannel = voiceRoomStore.currentVoiceChannel;
    const participants = voiceRoomStore.participants;

    const handleMicToggle = (): void => {
        setIsMicOn(!isMicOn);
        isMicOn ? voiceRoomStore.muteMicrophone() : voiceRoomStore.unmuteMicrophone();
        notificationStore.addNotification(
            isMicOn ? 'Микрофон заглушен' : 'Микрофон включен', 
            'info'
        );
    };

    const handleDeafenToggle = (): void => {
        setIsDeafened(!isDeafened);
        notificationStore.addNotification(
            isDeafened ? 'Звук включен' : 'Звук заглушен', 
            'info'
        );
        // TODO: Реализовать заглушение звука
    };

    const handleDisconnect = (): void => {
        voiceRoomStore.disconnectToRoom();
        notificationStore.addNotification('Отключились от голосового канала', 'info');
    };

    // Если не подключен к голосовому каналу, показываем минимальный интерфейс
    if (!currentVoiceChannel) {
        return (
            <div className="voice-controls">
                <div className="voice-controls__not-connected">
                    <div className="voice-controls__user-info">
                        <div className="voice-controls__avatar">
                            {currentUser?.profilePicture ? (
                                <img 
                                    src={currentUser.profilePicture} 
                                    alt={currentUser.username}
                                />
                            ) : (
                                <span>{currentUser?.username?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <div className="voice-controls__user-details">
                            <span className="voice-controls__username">{currentUser?.username || 'User'}</span>
                            <span className="voice-controls__status">Не подключен</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="voice-controls">
            {/* Информация о текущем голосовом канале */}
            <div className="voice-controls__channel-info">
                <div className="voice-controls__channel-header">
                    <span className="voice-controls__channel-name">🔊 {currentVoiceChannel.name}</span>
                    <span className="voice-controls__participant-count">{participants.length} участников</span>
                </div>
                
                {/* Список участников */}
                <div className="voice-controls__participants">
                    {participants.map((participant) => (
                        <div key={participant.socketId} className="voice-controls__participant">
                            <div className="voice-controls__participant-avatar">
                                {participant.userData?.profilePicture ? (
                                    <img 
                                        src={participant.userData.profilePicture} 
                                        alt={participant.userData.username}
                                    />
                                ) : (
                                    <span>{participant.userData?.username?.charAt(0).toUpperCase() || 'U'}</span>
                                )}
                                {participant.isSpeaking && (
                                    <div className="voice-controls__speaking-indicator"></div>
                                )}
                            </div>
                            <span className="voice-controls__participant-name">
                                {participant.userData?.username || 'Unknown User'}
                            </span>
                            <div className="voice-controls__participant-status">
                                {participant.micToggle ? '🎤' : '🔇'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Контролы пользователя */}
            <div className="voice-controls__user-controls">
                <div className="voice-controls__user-info">
                    <div className="voice-controls__avatar">
                        {currentUser?.profilePicture ? (
                            <img 
                                src={currentUser.profilePicture} 
                                alt={currentUser.username}
                            />
                        ) : (
                            <span>{currentUser?.username?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>
                    <div className="voice-controls__user-details">
                        <span className="voice-controls__username">{currentUser?.username || 'User'}</span>
                        <span className="voice-controls__status">
                            {isMicOn ? 'Говорит' : 'Заглушен'}
                        </span>
                    </div>
                </div>

                <div className="voice-controls__buttons">
                    <button 
                        className={`voice-controls__button ${!isMicOn ? 'voice-controls__button--muted' : ''}`}
                        onClick={handleMicToggle}
                        title={isMicOn ? 'Заглушить микрофон' : 'Включить микрофон'}
                    >
                        {isMicOn ? '🎤' : '🔇'}
                    </button>
                    
                    <button 
                        className={`voice-controls__button ${isDeafened ? 'voice-controls__button--deafened' : ''}`}
                        onClick={handleDeafenToggle}
                        title={isDeafened ? 'Включить звук' : 'Заглушить звук'}
                    >
                        {isDeafened ? '🔇' : '🔊'}
                    </button>
                    
                    <button 
                        className="voice-controls__button voice-controls__button--settings"
                        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                        title="Настройки звука"
                    >
                        ⚙️
                    </button>
                    
                    <button 
                        className="voice-controls__button voice-controls__button--disconnect"
                        onClick={handleDisconnect}
                        title="Отключиться"
                    >
                        📞
                    </button>
                </div>
            </div>

            {/* Слайдер громкости */}
            {showVolumeSlider && (
                <div className="voice-controls__volume-slider">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue="100"
                        className="voice-controls__volume-input"
                    />
                </div>
            )}
        </div>
    );
});

export default VoiceControls;
