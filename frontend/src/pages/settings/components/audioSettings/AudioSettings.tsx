import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SpeakerSettings from './SpeakerSettings';
import MicrophoneSettings from './MicrophoneSettings';

const AudioSettings: React.FC = () => {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<'devices' | 'quality'>('devices');

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('settingsPage.audio.title')}</h2>
                <p>{t('settingsPage.audio.description')}</p>
            </div>

            <div className="section-content">
                {/* Навигация по разделам */}
                <div className="settings-tabs">
                    <button
                        className={`tab-button ${activeSection === 'devices' ? 'active' : ''}`}
                        onClick={() => setActiveSection('devices')}
                    >
                        🎤 {t('settingsPage.audio.tabs.devices')}
                    </button>
                    <button
                        className={`tab-button ${activeSection === 'quality' ? 'active' : ''}`}
                        onClick={() => setActiveSection('quality')}
                    >
                        🎵 {t('settingsPage.audio.tabs.quality')}
                    </button>
                </div>

                {/* Содержимое разделов */}
                {activeSection === 'devices' && (
                    <div className="settings-grid two-columns">
                        <MicrophoneSettings />
                        <SpeakerSettings />
                    </div>
                )}

                {activeSection === 'quality' && (
                    <div className="settings-card">
                        <div className="card-header">
                            <div className="header-content">
                                <div className="icon-container">🎵</div>
                                <div className="header-text">
                                    <h3>{t('settingsPage.audio.tabs.quality')}</h3>
                                    <p>Настройки качества звука</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="setting-group">
                                <label className="setting-label">
                                    <span>Качество звука</span>
                                </label>
                                <div className="setting-control">
                                    <select className="settings-select" defaultValue="high">
                                        <option value="low">Низкое</option>
                                        <option value="medium">Среднее</option>
                                        <option value="high">Высокое</option>
                                    </select>
                                    <div className="setting-description">
                                        Высокое качество использует больше трафика
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AudioSettings;

