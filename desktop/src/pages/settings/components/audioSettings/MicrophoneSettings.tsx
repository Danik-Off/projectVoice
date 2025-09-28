import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import audioSettingsStore from '../../../../store/AudioSettingsStore';
import { MicrophoneIcon, SettingsIcon, WaveIcon, QualityIcon } from './icons';
import MicrophoneVisualizer from './MicrophoneVisualizer/MicrophoneVisualizer';

const MicrophoneSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

    return (
        <div className="audio-settings-card microphone-settings">
            <div className="card-header">
                <div className="header-content">
                    <div className="icon-container">
                        <MicrophoneIcon />
                    </div>
                    <div className="header-text">
                        <h3 className="card-title">Микрофон</h3>
                        <p className="card-subtitle">Настройки записи звука</p>
                    </div>
                </div>
                <div className="header-actions">
                    <div className="tab-buttons">
                        <button 
                            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
                            onClick={() => setActiveTab('basic')}
                        >
                            Основные
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
                            onClick={() => setActiveTab('advanced')}
                        >
                            Расширенные
                        </button>
                    </div>
                </div>
            </div>

            <div className="card-content">
                {/* Визуализатор микрофона */}
                <div className="visualizer-section">
                    <MicrophoneVisualizer />
                </div>

                {/* Основные настройки */}
                {activeTab === 'basic' && (
                    <div className="settings-section">
                        <div className="setting-group">
                            <label className="setting-label">
                                <MicrophoneIcon />
                                <span>Устройство записи</span>
                            </label>
                            <div className="setting-control">
                                <select
                                    value={audioSettingsStore.selectedMicrophone?.deviceId || ''}
                                    onChange={(e) => audioSettingsStore.setMicrophone(e.target.value)}
                                    className="device-select"
                                >
                                    <option value="">Выберите микрофон</option>
                                    {audioSettingsStore.microphoneDevices.map((device) => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                            {device.label || t('settingsPage.audio.unknownDevice')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Громкость микрофона</span>
                            </label>
                            <div className="setting-control">
                                <div className="volume-control">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={audioSettingsStore.volume}
                                        onChange={(e) => audioSettingsStore.setVolume(parseInt(e.target.value))}
                                        className="volume-slider"
                                    />
                                    <span className="volume-value">{audioSettingsStore.volume}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <WaveIcon />
                                <span>Канал записи</span>
                            </label>
                            <div className="setting-control">
                                <div className="radio-group">
                                    <label className="radio-item">
                                        <input
                                            type="radio"
                                            name="channel"
                                            value="mono"
                                            checked={audioSettingsStore.channelCount === 1}
                                            onChange={() => audioSettingsStore.setChannelCount('mono')}
                                            className="custom-radio"
                                        />
                                        <span className="radio-mark"></span>
                                        <span>Моно (1 канал)</span>
                                    </label>
                                    <label className="radio-item">
                                        <input
                                            type="radio"
                                            name="channel"
                                            value="stereo"
                                            checked={audioSettingsStore.channelCount === 2}
                                            onChange={() => audioSettingsStore.setChannelCount('stereo')}
                                            className="custom-radio"
                                        />
                                        <span className="radio-mark"></span>
                                        <span>Стерео (2 канала)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Расширенные настройки */}
                {activeTab === 'advanced' && (
                    <div className="settings-section">
                        <div className="setting-group">
                            <label className="setting-label">
                                <QualityIcon />
                                <span>Качество записи</span>
                            </label>
                            <div className="setting-control">
                                <div className="quality-controls">
                                    <div className="quality-row">
                                        <label>Частота дискретизации:</label>
                                        <select
                                            value={audioSettingsStore.sampleRate}
                                            onChange={(e) => audioSettingsStore.setSampleRate(parseInt(e.target.value))}
                                            className="quality-select"
                                        >
                                            <option value="8000">8 кГц</option>
                                            <option value="16000">16 кГц</option>
                                            <option value="22050">22.05 кГц</option>
                                            <option value="44100">44.1 кГц</option>
                                            <option value="48000">48 кГц</option>
                                        </select>
                                    </div>
                                    <div className="quality-row">
                                        <label>Битность:</label>
                                        <select
                                            value={audioSettingsStore.sampleSize}
                                            onChange={(e) => audioSettingsStore.setSampleSize(parseInt(e.target.value))}
                                            className="quality-select"
                                        >
                                            <option value="8">8 бит</option>
                                            <option value="16">16 бит</option>
                                            <option value="24">24 бита</option>
                                            <option value="32">32 бита</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <SettingsIcon />
                                <span>Обработка звука</span>
                            </label>
                            <div className="setting-control">
                                <div className="checkbox-group">
                                    <label className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.echoCancellation}
                                            onChange={(e) => audioSettingsStore.setEchoCancellation(e.target.checked)}
                                            className="custom-checkbox"
                                        />
                                        <span className="checkmark"></span>
                                        <span>Эхо-канселлинг</span>
                                    </label>
                                    <label className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.noiseSuppression}
                                            onChange={(e) => audioSettingsStore.setNoiseSuppression(e.target.checked)}
                                            className="custom-checkbox"
                                        />
                                        <span className="checkmark"></span>
                                        <span>Шумоподавление</span>
                                    </label>
                                    <label className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={audioSettingsStore.autoGainControl}
                                            onChange={(e) => audioSettingsStore.setAutoGainControl(e.target.checked)}
                                            className="custom-checkbox"
                                        />
                                        <span className="checkmark"></span>
                                        <span>Автоматический контроль громкости</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label className="setting-label">
                                <SettingsIcon />
                                <span>Задержка</span>
                            </label>
                            <div className="setting-control">
                                <div className="latency-control">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={audioSettingsStore.latency}
                                        onChange={(e) => audioSettingsStore.setLatency(parseInt(e.target.value))}
                                        className="latency-slider"
                                    />
                                    <span className="latency-value">{audioSettingsStore.latency}мс</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Информация об устройстве */}
                {audioSettingsStore.selectedMicrophone && (
                    <div className="device-info">
                        <div className="info-header">
                            <h4>Информация о микрофоне</h4>
                        </div>
                        <div className="info-content">
                            <div className="info-row">
                                <span className="info-label">Название:</span>
                                <span className="info-value">{audioSettingsStore.selectedMicrophone.label}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">ID:</span>
                                <span className="info-value device-id">{audioSettingsStore.selectedMicrophone.deviceId}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Статус:</span>
                                <span className="info-value status-active">Активен</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Качество:</span>
                                <span className="info-value">{audioSettingsStore.sampleRate}Hz / {audioSettingsStore.sampleSize}bit</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default MicrophoneSettings;
