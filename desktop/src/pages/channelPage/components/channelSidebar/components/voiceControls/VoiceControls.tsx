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
    // Убираем локальные состояния, используем данные из store
    const [showVolumeSlider] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showAudioSettingsModal, setShowAudioSettingsModal] = useState<boolean>(false);
    const { openProfile } = useUserProfile();

    const currentUser = authStore.user;
    const currentVoiceChannel = voiceRoomStore.currentVoiceChannel;
    const participants = voiceRoomStore.participants;
    const isLocalSpeaking = voiceRoomStore.getLocalSpeakingState();
    
    // Фильтруем участников, исключая текущего пользователя
    const otherParticipants = participants.filter(participant => 
        participant.userData?.id !== currentUser?.id
    );

    const handleMicToggle = (): void => {
        audioSettingsStore.toggleMicrophoneMute();
        notificationStore.addNotification(
            audioSettingsStore.isMicrophoneMuted ? t('voiceControls.micOff') : t('voiceControls.micOn'), 
            'info'
        );
    };

    const handleDeafenToggle = (): void => {
        audioSettingsStore.toggleSpeakerMute();
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
                                className={`voice-controls__avatar ${isLocalSpeaking ? 'voice-controls__avatar--speaking' : ''}`}
                            />
                        )}
                        <div className="voice-controls__user-details">
                            <span className="voice-controls__username">{currentUser?.username || 'User'}</span>
                            <span className={`voice-controls__status ${isLocalSpeaking ? 'voice-controls__status--speaking' : ''}`}>
                                {isLocalSpeaking ? 'Говорит' : (audioSettingsStore.isMicrophoneMuted ? 'Микрофон выключен' : 'Молчит')}
                            </span>
                        </div>
                    </div>

                    <div className="voice-controls__controls">
                        <button 
                            className={`voice-controls__button ${audioSettingsStore.isMicrophoneMuted ? 'voice-controls__button--muted' : ''}`}
                            onClick={handleMicToggle}
                            title={audioSettingsStore.isMicrophoneMuted ? t('voiceControls.micOn') : t('voiceControls.micOff')}
                        >
                            {audioSettingsStore.isMicrophoneMuted ? '🔇' : '🎤'}
                        </button>
                        
                        <button 
                            className={`voice-controls__button ${audioSettingsStore.isSpeakerMuted ? 'voice-controls__button--deafened' : ''}`}
                            onClick={handleDeafenToggle}
                            title={audioSettingsStore.isSpeakerMuted ? t('voiceControls.deafenOff') : t('voiceControls.deafenOn')}
                        >
                            {audioSettingsStore.isSpeakerMuted ? '🔇' : '🔊'}
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
                                            className={`voice-controls__participant-avatar ${participant.isSpeaking ? 'voice-controls__participant-avatar--speaking' : ''}`}
                                        />
                                    )}

                                    <div className="voice-controls__participant-info">
                                        <span className="voice-controls__participant-name">
                                            {participant.userData?.username || 'Unknown User'}
                                        </span>
                                        <span className={`voice-controls__participant-status ${participant.isSpeaking ? 'voice-controls__participant-status--speaking' : ''}`}>
                                            {participant.isSpeaking
                                                ? 'Говорит'
                                                : (participant.micToggle
                                                    ? 'Молчит'
                                                    : 'Микрофон выключен')}
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
                            {/* Переключатель режимов */}
                            <div className="voice-controls__audio-section">
                                <h4>⚙️ Режим настроек</h4>
                                <div className="voice-controls__mode-switcher">
                                    <button 
                                        className={`voice-controls__mode-btn ${audioSettingsStore.settingsMode === 'simple' ? 'active' : ''}`}
                                        onClick={() => audioSettingsStore.setSettingsMode('simple')}
                                    >
                                        Простой
                                    </button>
                                    <button 
                                        className={`voice-controls__mode-btn ${audioSettingsStore.settingsMode === 'detailed' ? 'active' : ''}`}
                                        onClick={() => audioSettingsStore.setSettingsMode('detailed')}
                                    >
                                        Детальный
                                    </button>
                                </div>
                            </div>

                            {/* Простой режим */}
                            {audioSettingsStore.settingsMode === 'simple' && (
                                <div className="voice-controls__audio-section">
                                    <h4>🎵 Качество звука</h4>
                                    <div className="voice-controls__quality-selector">
                                        <button 
                                            className={`voice-controls__quality-btn ${audioSettingsStore.audioQuality === 'low' ? 'active' : ''}`}
                                            onClick={() => audioSettingsStore.setAudioQuality('low')}
                                        >
                                            <div className="voice-controls__quality-title">Низкое</div>
                                            <div className="voice-controls__quality-desc">Экономия трафика, базовая обработка</div>
                                        </button>
                                        <button 
                                            className={`voice-controls__quality-btn ${audioSettingsStore.audioQuality === 'medium' ? 'active' : ''}`}
                                            onClick={() => audioSettingsStore.setAudioQuality('medium')}
                                        >
                                            <div className="voice-controls__quality-title">Среднее</div>
                                            <div className="voice-controls__quality-desc">Оптимальный баланс качества и производительности</div>
                                        </button>
                                        <button 
                                            className={`voice-controls__quality-btn ${audioSettingsStore.audioQuality === 'high' ? 'active' : ''}`}
                                            onClick={() => audioSettingsStore.setAudioQuality('high')}
                                        >
                                            <div className="voice-controls__quality-title">Максимальное</div>
                                            <div className="voice-controls__quality-desc">48kHz/24bit, 320kbps, минимальная задержка</div>
                                        </button>
                                        <button 
                                            className={`voice-controls__quality-btn ${audioSettingsStore.audioQuality === 'ultra' ? 'active' : ''}`}
                                            onClick={() => audioSettingsStore.setAudioQuality('ultra')}
                                        >
                                            <div className="voice-controls__quality-title">Ультра</div>
                                            <div className="voice-controls__quality-desc">48kHz/32bit, 512kbps, профессиональное качество</div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Детальный режим */}
                            {audioSettingsStore.settingsMode === 'detailed' && (
                                <>
                                    {/* Основные настройки */}
                                    <div className="voice-controls__audio-section">
                                        <h4>🔧 Основные настройки</h4>
                                        
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

                                    {/* Улучшение голоса */}
                                    <div className="voice-controls__audio-section">
                                        <h4>🎤 Улучшение голоса</h4>
                                        
                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <input
                                                    type="checkbox"
                                                    checked={audioSettingsStore.voiceEnhancement}
                                                    onChange={(e) => audioSettingsStore.setVoiceEnhancement(e.target.checked)}
                                                />
                                                <span>Улучшение голоса</span>
                                            </label>
                                            <div className="voice-controls__audio-description">
                                                Общее улучшение качества голоса
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Четкость голоса</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={audioSettingsStore.voiceClarity * 100}
                                                    onChange={(e) => audioSettingsStore.setVoiceClarity(Number(e.target.value) / 100)}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{Math.round(audioSettingsStore.voiceClarity * 100)}%</span>
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Снижение фонового шума</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={audioSettingsStore.backgroundNoiseReduction * 100}
                                                    onChange={(e) => audioSettingsStore.setBackgroundNoiseReduction(Number(e.target.value) / 100)}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{Math.round(audioSettingsStore.backgroundNoiseReduction * 100)}%</span>
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Усиление голоса</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={audioSettingsStore.voiceBoost * 100}
                                                    onChange={(e) => audioSettingsStore.setVoiceBoost(Number(e.target.value) / 100)}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{Math.round(audioSettingsStore.voiceBoost * 100)}%</span>
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <input
                                                    type="checkbox"
                                                    checked={audioSettingsStore.voiceIsolation}
                                                    onChange={(e) => audioSettingsStore.setVoiceIsolation(e.target.checked)}
                                                />
                                                <span>Изоляция голоса</span>
                                            </label>
                                            <div className="voice-controls__audio-description">
                                                Выделяет только голосовые частоты
                                            </div>
                                        </div>
                                    </div>

                                    {/* Эквалайзер */}
                                    <div className="voice-controls__audio-section">
                                        <h4>🎛️ Эквалайзер</h4>
                                        
                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Усиление басов</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={audioSettingsStore.bassBoost * 100}
                                                    onChange={(e) => audioSettingsStore.setBassBoost(Number(e.target.value) / 100)}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{Math.round(audioSettingsStore.bassBoost * 100)}%</span>
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Усиление высоких частот</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={audioSettingsStore.trebleBoost * 100}
                                                    onChange={(e) => audioSettingsStore.setTrebleBoost(Number(e.target.value) / 100)}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{Math.round(audioSettingsStore.trebleBoost * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Дополнительные эффекты */}
                                    <div className="voice-controls__audio-section">
                                        <h4>✨ Дополнительные эффекты</h4>
                                        
                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <input
                                                    type="checkbox"
                                                    checked={audioSettingsStore.stereoEnhancement}
                                                    onChange={(e) => audioSettingsStore.setStereoEnhancement(e.target.checked)}
                                                />
                                                <span>Стерео улучшение</span>
                                            </label>
                                            <div className="voice-controls__audio-description">
                                                Улучшает стерео эффект
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <input
                                                    type="checkbox"
                                                    checked={audioSettingsStore.spatialAudio}
                                                    onChange={(e) => audioSettingsStore.setSpatialAudio(e.target.checked)}
                                                />
                                                <span>Пространственный звук</span>
                                            </label>
                                            <div className="voice-controls__audio-description">
                                                Создает эффект объемного звучания
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Динамическое сжатие</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={audioSettingsStore.dynamicRangeCompression * 100}
                                                    onChange={(e) => audioSettingsStore.setDynamicRangeCompression(Number(e.target.value) / 100)}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{Math.round(audioSettingsStore.dynamicRangeCompression * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Технические настройки */}
                                    <div className="voice-controls__audio-section">
                                        <h4>⚙️ Технические настройки</h4>
                                        
                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Частота дискретизации</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="8000"
                                                    max="48000"
                                                    step="8000"
                                                    value={audioSettingsStore.sampleRate}
                                                    onChange={(e) => audioSettingsStore.setSampleRate(Number(e.target.value))}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{audioSettingsStore.sampleRate} Гц</span>
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Битрейт</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="64"
                                                    max="320"
                                                    step="32"
                                                    value={audioSettingsStore.bitrate}
                                                    onChange={(e) => audioSettingsStore.setBitrate(Number(e.target.value))}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{audioSettingsStore.bitrate} kbps</span>
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Задержка</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="25"
                                                    max="500"
                                                    step="25"
                                                    value={audioSettingsStore.latency}
                                                    onChange={(e) => audioSettingsStore.setLatency(Number(e.target.value))}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{audioSettingsStore.latency} мс</span>
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Размер буфера</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="1024"
                                                    max="8192"
                                                    step="512"
                                                    value={audioSettingsStore.bufferSize}
                                                    onChange={(e) => audioSettingsStore.setBufferSize(Number(e.target.value))}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{audioSettingsStore.bufferSize} сэмплов</span>
                                            </div>
                                        </div>

                                        <div className="voice-controls__audio-setting">
                                            <label className="voice-controls__audio-label">
                                                <span>Уровень сжатия</span>
                                            </label>
                                            <div className="voice-controls__audio-control">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    step="5"
                                                    value={audioSettingsStore.compressionLevel * 100}
                                                    onChange={(e) => audioSettingsStore.setCompressionLevel(Number(e.target.value) / 100)}
                                                    className="voice-controls__audio-slider"
                                                />
                                                <span className="voice-controls__audio-value">{Math.round(audioSettingsStore.compressionLevel * 100)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

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
                                    <button 
                                        className="voice-controls__audio-test-btn voice-controls__audio-test-btn--advanced"
                                        onClick={() => {
                                            import('../../../../../../utils/audioTest').then(({ audioTest }) => {
                                                audioTest.testDefaultSettings();
                                                audioTest.testAudioQuality();
                                            });
                                        }}
                                    >
                                        🔬 Полный тест
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
