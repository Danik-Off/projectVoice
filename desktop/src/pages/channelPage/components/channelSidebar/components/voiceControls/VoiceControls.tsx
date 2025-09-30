import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import './VoiceControls.scss';
import voiceRoomStore from '../../../../../../store/roomStore';
import { authStore } from '../../../../../../store/authStore';
import notificationStore from '../../../../../../store/NotificationStore';
import { useUserProfile } from '../../../../../../components/UserProfileProvider';
import ClickableAvatar from '../../../../../../components/ClickableAvatar';
import audioSettingsStore from '../../../../../../store/AudioSettingsStore';
import participantVolumeStore from '../../../../../../store/ParticipantVolumeStore';

const VoiceControls: React.FC = observer(() => {
    const { t } = useTranslation();
    const [isMicOn, setIsMicOn] = useState<boolean>(true);
    const [isDeafened, setIsDeafened] = useState<boolean>(false);
    const [showVolumeSlider] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showAudioSettingsModal, setShowAudioSettingsModal] = useState<boolean>(false);
    const { openProfile } = useUserProfile();

    const currentUser = authStore.user;
    const currentVoiceChannel = voiceRoomStore.currentVoiceChannel;
    const participants = voiceRoomStore.participants;
    const isLocalSpeaking = voiceRoomStore.getLocalSpeakingState();
    const localVolumeLevel = voiceRoomStore.getLocalVolumeLevel();
    
    // Фильтруем участников, исключая текущего пользователя
    const otherParticipants = participants.filter(participant => 
        participant.userData?.id !== currentUser?.id
    );

    const handleMicToggle = (): void => {
        audioSettingsStore.toggleMicrophoneMute();
        setIsMicOn(!audioSettingsStore.isMicrophoneMuted);
        notificationStore.addNotification(
            audioSettingsStore.isMicrophoneMuted ? t('voiceControls.micOff') : t('voiceControls.micOn'), 
            'info'
        );
    };

    const handleDeafenToggle = (): void => {
        audioSettingsStore.toggleSpeakerMute();
        setIsDeafened(audioSettingsStore.isSpeakerMuted);
        notificationStore.addNotification(
            audioSettingsStore.isSpeakerMuted ? t('voiceControls.deafenOn') : t('voiceControls.deafenOff'), 
            'info'
        );
    };

    const handleDisconnect = (): void => {
        voiceRoomStore.disconnectToRoom();
        notificationStore.addNotification(t('voiceControls.disconnect'), 'info');
    };

    const handleExpand = (): void => {
        console.log('handleExpand called, current isExpanded:', isExpanded);
        setIsExpanded(!isExpanded);
        console.log('New isExpanded will be:', !isExpanded);
    };

    const handleParticipantVolumeChange = (socketId: string, volume: number): void => {
        // Обновляем громкость через WebRTCClient
        voiceRoomStore.webRTCClient?.setParticipantVolume(socketId, volume);
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
                        {currentUser && (
                            <ClickableAvatar
                                user={currentUser}
                                size="medium"
                                onClick={() => openProfile(currentUser, true)}
                                className="voice-controls__avatar"
                            />
                        )}
                        <div className="voice-controls__user-details">
                            <span className="voice-controls__username">{currentUser?.username || 'User'}</span>
                            <span className={`voice-controls__status ${isLocalSpeaking ? 'voice-controls__status--speaking' : ''}`}>
                                {isLocalSpeaking ? '🎤 Говорит' : (isMicOn ? t('voiceControls.micOn') : t('voiceControls.micOff'))}
                                {isLocalSpeaking && (
                                    <span className="voice-controls__volume-level">
                                        ({localVolumeLevel.toFixed(0)}%)
                                    </span>
                                )}
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
                            onClick={() => setShowAudioSettingsModal(!showAudioSettingsModal)}
                            title="Настройки звука"
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
                        <h4 className="voice-controls__section-title">Участники ({otherParticipants.length})</h4>
                        <div className="voice-controls__participants-list">
                            {otherParticipants.map((participant) => (
                                <div key={participant.socketId} className="voice-controls__participant">
                                    {participant.userData && (
                                        <ClickableAvatar
                                            user={{
                                                ...participant.userData,
                                                email: `${participant.userData.username}@temp.com`, // Временное решение
                                                isActive: true,
                                                createdAt: new Date().toISOString(),
                                                status: 'online'
                                            }}
                                            size="small"
                                                                                onClick={() => {
                                        if (participant.userData) {
                                            openProfile({
                                                ...participant.userData,
                                                email: `${participant.userData.username}@temp.com`,
                                                isActive: true,
                                                createdAt: new Date().toISOString(),
                                                status: 'online'
                                            }, false);
                                        }
                                    }}
                                            className="voice-controls__participant-avatar"
                                        />
                                    )}
                                    {participant.isSpeaking && (
                                        <div className="voice-controls__speaking-indicator"></div>
                                    )}
                                    <div className="voice-controls__participant-info">
                                        <span className="voice-controls__participant-name">
                                            {participant.userData?.username || 'Unknown User'}
                                        </span>
                                        <span className={`voice-controls__participant-status ${participant.isSpeaking ? 'voice-controls__participant-status--speaking' : ''}`}>
                                            {participant.isSpeaking ? `🎤 Говорит (${voiceRoomStore.getParticipantVolumeLevel(participant.socketId).toFixed(0)}%)` : (participant.micToggle ? '🔇 Молчит' : '🔇 Выключен')}
                                        </span>
                                    </div>
                                    <div className="voice-controls__participant-controls">
                                        <div className="voice-controls__participant-mic">
                                            {participant.micToggle ? '🎤' : '🔇'}
                                        </div>
                                        <div className="voice-controls__participant-volume">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={participantVolumeStore.getParticipantVolume(participant.socketId)}
                                                onChange={(e) => handleParticipantVolumeChange(participant.socketId, Number(e.target.value))}
                                                className="voice-controls__volume-slider"
                                                title={`Громкость ${participant.userData?.username || 'участника'}`}
                                            />
                                            <span className="voice-controls__volume-value">
                                                {participantVolumeStore.getParticipantVolume(participant.socketId)}%
                                            </span>
                                        </div>
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

            {/* Модальное окно настроек звука */}
            {showAudioSettingsModal && (
                <div className="voice-controls__audio-modal-overlay" onClick={() => setShowAudioSettingsModal(false)}>
                    <div className="voice-controls__audio-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="voice-controls__audio-modal-header">
                            <h3>Настройки звука</h3>
                            <button 
                                className="voice-controls__audio-modal-close"
                                onClick={() => setShowAudioSettingsModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="voice-controls__audio-modal-content">
                            {/* Фильтры звука */}
                            <div className="voice-controls__audio-section">
                                <h4>🔧 Фильтры звука</h4>
                                
                                <div className="voice-controls__audio-setting">
                                    <label className="voice-controls__audio-label">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.echoCancellation}
                                            onChange={(e) => audioSettingsStore.setEchoCancellation(e.target.checked)}
                                        />
                                        <span>Подавление эха</span>
                                    </label>
                                    <div className="voice-controls__audio-description">
                                        Убирает эхо и обратную связь
                                    </div>
                                </div>

                                <div className="voice-controls__audio-setting">
                                    <label className="voice-controls__audio-label">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.noiseSuppression}
                                            onChange={(e) => audioSettingsStore.setNoiseSuppression(e.target.checked)}
                                        />
                                        <span>Шумоподавление</span>
                                    </label>
                                    <div className="voice-controls__audio-description">
                                        Убирает фоновые шумы
                                    </div>
                                </div>

                                <div className="voice-controls__audio-setting">
                                    <label className="voice-controls__audio-label">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.autoGainControl}
                                            onChange={(e) => audioSettingsStore.setAutoGainControl(e.target.checked)}
                                        />
                                        <span>Автоконтроль громкости</span>
                                    </label>
                                    <div className="voice-controls__audio-description">
                                        Автоматически регулирует уровень звука
                                    </div>
                                </div>
                            </div>

                            {/* Настройки громкости */}
                            <div className="voice-controls__audio-section">
                                <h4>🔊 Громкость</h4>
                                
                                <div className="voice-controls__audio-setting">
                                    <label className="voice-controls__audio-label">
                                        <span>Громкость микрофона</span>
                                    </label>
                                    <div className="voice-controls__audio-control">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={audioSettingsStore.volume}
                                            onChange={(e) => audioSettingsStore.setVolume(Number(e.target.value))}
                                            className="voice-controls__audio-slider"
                                        />
                                        <span className="voice-controls__audio-value">{audioSettingsStore.volume}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Тестирование */}
                            <div className="voice-controls__audio-section">
                                <h4>🧪 Тестирование</h4>
                                
                                <div className="voice-controls__audio-test-buttons">
                                    <button 
                                        className="voice-controls__audio-test-btn"
                                        onClick={() => audioSettingsStore.testMicrophone()}
                                    >
                                        🎤 Тест микрофона
                                    </button>
                                    <button 
                                        className="voice-controls__audio-test-btn"
                                        onClick={() => audioSettingsStore.testSpeakers()}
                                    >
                                        🔊 Тест динамиков
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
});

export default VoiceControls;
