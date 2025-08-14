import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import audioSettingsStore from '../../../../store/AudioSettingsStore';
import { SpeakerIcon, TestIcon, VolumeIcon, SettingsIcon } from './icons';

const SpeakerSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const [isTesting, setIsTesting] = useState(false);
    const [testVolume, setTestVolume] = useState(50);

    const handleTest = async () => {
        setIsTesting(true);
        try {
            await audioSettingsStore.testSpeakers();
            // Показываем уведомление об успешном тесте
            setTimeout(() => setIsTesting(false), 2000);
        } catch (error) {
            console.error('Test failed:', error);
            setIsTesting(false);
        }
    };

    const handleVolumeChange = (volume: number) => {
        setTestVolume(volume);
        // Здесь можно добавить логику для изменения громкости теста
    };

    return (
        <div className="audio-settings-card speaker-settings">
            <div className="card-header">
                <div className="header-content">
                    <div className="icon-container">
                        <SpeakerIcon />
                    </div>
                    <div className="header-text">
                        <h3 className="card-title">Динамики</h3>
                        <p className="card-subtitle">Настройки воспроизведения звука</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button 
                        className={`test-button ${isTesting ? 'testing' : ''}`}
                        onClick={handleTest}
                        disabled={isTesting}
                    >
                        <TestIcon />
                        <span>{isTesting ? 'Тестируем...' : 'Тест'}</span>
                    </button>
                </div>
            </div>

            <div className="card-content">
                <div className="settings-section">
                    <div className="setting-group">
                        <label className="setting-label">
                            <VolumeIcon />
                            <span>Устройство воспроизведения</span>
                        </label>
                        <div className="setting-control">
                            <select
                                value={audioSettingsStore.selectedSpeaker?.deviceId || ''}
                                onChange={(e) => audioSettingsStore.setSpeaker(e.target.value)}
                                className="device-select"
                            >
                                <option value="">Выберите устройство</option>
                                {audioSettingsStore.speakerDevices.map((device) => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || t('settingsPage.audio.unknownDevice')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="setting-group">
                        <label className="setting-label">
                            <VolumeIcon />
                            <span>Громкость теста</span>
                        </label>
                        <div className="setting-control">
                            <div className="volume-control">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={testVolume}
                                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                                    className="volume-slider"
                                />
                                <span className="volume-value">{testVolume}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="setting-group">
                        <label className="setting-label">
                            <SettingsIcon />
                            <span>Дополнительные настройки</span>
                        </label>
                        <div className="setting-control">
                            <div className="checkbox-group">
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="custom-checkbox"
                                    />
                                    <span className="checkmark"></span>
                                    <span>Автоматическая регулировка громкости</span>
                                </label>
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="custom-checkbox"
                                    />
                                    <span className="checkmark"></span>
                                    <span>Нормализация звука</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {audioSettingsStore.selectedSpeaker && (
                    <div className="device-info">
                        <div className="info-header">
                            <h4>Информация об устройстве</h4>
                        </div>
                        <div className="info-content">
                            <div className="info-row">
                                <span className="info-label">Название:</span>
                                <span className="info-value">{audioSettingsStore.selectedSpeaker.label}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">ID:</span>
                                <span className="info-value device-id">{audioSettingsStore.selectedSpeaker.deviceId}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Статус:</span>
                                <span className="info-value status-active">Активно</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default SpeakerSettings;
