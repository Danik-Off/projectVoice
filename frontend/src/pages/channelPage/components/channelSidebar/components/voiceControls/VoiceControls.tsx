import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import './VoiceControls.scss';
import voiceRoomStore from '../../../../../../store/roomStore';
import { authStore } from '../../../../../../store/authStore';
import notificationStore from '../../../../../../store/NotificationStore';

const VoiceControls: React.FC = observer(() => {
    const { t } = useTranslation();
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isDeafened, setIsDeafened] = useState<boolean>(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const currentUser = authStore.user;
    const currentVoiceChannel = voiceRoomStore.currentVoiceChannel;
    const participants = voiceRoomStore.participants;

    const handleMicToggle = (): void => {
        setIsMicOn(!isMicOn);
        isMicOn ? voiceRoomStore.muteMicrophone() : voiceRoomStore.unmuteMicrophone();
        notificationStore.addNotification(
            isMicOn ? t('voiceControls.micOff') : t('voiceControls.micOn'), 
            'info'
        );
    };

    const handleDeafenToggle = (): void => {
        setIsDeafened(!isDeafened);
        notificationStore.addNotification(
            isDeafened ? t('voiceControls.deafenOff') : t('voiceControls.deafenOn'), 
            'info'
        );
        // TODO: Реализовать заглушение звука
    };

    const handleDisconnect = (): void => {
        voiceRoomStore.disconnectToRoom();
        notificationStore.addNotification(t('voiceControls.disconnect'), 'info');
    };

    const handleExpand = (): void => {
        setIsExpanded(!isExpanded);
    };

    // Если не подключен к голосовому каналу, не показываем контролы
    if (!currentVoiceChannel) {
        return null;
    }

    return (
        <div className={`voice-controls ${isExpanded ? 'voice-controls--expanded' : ''}`}>
            {/* Основная панель */}
            <div className="voice-controls__main-panel">
                <div className="voice-controls__channel-info">
                    <div className="voice-controls__channel-header">
                        <div className="voice-controls__channel-icon">🔊</div>
                        <div className="voice-controls__channel-details">
                            <span className="voice-controls__channel-name">{currentVoiceChannel.name}</span>
                            <span className="voice-controls__participant-count">{participants.length} {t('voiceControls.participants')}</span>
                        </div>
                    </div>
                </div>

                <div className="voice-controls__user-section">
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
                                {isMicOn ? t('voiceControls.speaking') : t('voiceControls.micOff')}
                            </span>
                        </div>
                    </div>

                    <div className="voice-controls__controls">
                        <button 
                            className={`voice-controls__button ${!isMicOn ? 'voice-controls__button--muted' : ''}`}
                            onClick={handleMicToggle}
                            title={isMicOn ? t('voiceControls.micOff') : t('voiceControls.micOn')}
                        >
                            {isMicOn ? '🎤' : '🔇'}
                        </button>
                        
                        <button 
                            className={`voice-controls__button ${isDeafened ? 'voice-controls__button--deafened' : ''}`}
                            onClick={handleDeafenToggle}
                            title={isDeafened ? t('voiceControls.deafenOff') : t('voiceControls.deafenOn')}
                        >
                            {isDeafened ? '🔇' : '🔊'}
                        </button>
                        
                        <button 
                            className="voice-controls__button voice-controls__button--settings"
                            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                            title={t('voiceControls.volume')}
                        >
                            ⚙️
                        </button>
                        
                        <button 
                            className="voice-controls__button voice-controls__button--expand"
                            onClick={handleExpand}
                            title={isExpanded ? "Свернуть" : "Развернуть"}
                        >
                            {isExpanded ? '⬆️' : '⬇️'}
                        </button>
                        
                        <button 
                            className="voice-controls__button voice-controls__button--disconnect"
                            onClick={handleDisconnect}
                            title={t('voiceControls.disconnect')}
                        >
                            📞
                        </button>
                    </div>
                </div>
            </div>

            {/* Расширенная панель */}
            {isExpanded && (
                <div className="voice-controls__expanded-panel">
                    <div className="voice-controls__participants-section">
                        <h4 className="voice-controls__section-title">Участники ({participants.length})</h4>
                        <div className="voice-controls__participants-list">
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
                                    <div className="voice-controls__participant-info">
                                        <span className="voice-controls__participant-name">
                                            {participant.userData?.username || 'Unknown User'}
                                        </span>
                                        <span className="voice-controls__participant-status">
                                            {participant.isSpeaking && `(${t('voiceControls.speaking')})`}
                                        </span>
                                    </div>
                                    <div className="voice-controls__participant-mic">
                                        {participant.micToggle ? '🎤' : '🔇'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showVolumeSlider && (
                        <div className="voice-controls__volume-section">
                            <h4 className="voice-controls__section-title">Громкость</h4>
                            <div className="voice-controls__volume-controls">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    defaultValue="100"
                                    className="voice-controls__volume-slider"
                                />
                                <span className="voice-controls__volume-value">100%</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default VoiceControls;
