import React, { useState } from 'react';
import './Settings.scss';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../store/ThemeStore';
import AudioSettingsGroup from './audioSettings/audioSettings';
import MicrophoneSettingsGroup from './audioSettings/microphoneSettingsGroup';
import { useNavigate } from 'react-router-dom';

type SettingsTab = 'general' | 'appearance' | 'audio' | 'notifications' | 'privacy' | 'about';

const Settings = observer(() => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    const handleThemeToggle = () => {
        themeStore.toggleTheme();
    };

    const tabs: Array<{ id: SettingsTab; label: string; icon: string }> = [
        { id: 'general', label: t('settingsPage.tabs.general'), icon: '⚙️' },
        { id: 'appearance', label: t('settingsPage.tabs.appearance'), icon: '🎨' },
        { id: 'audio', label: t('settingsPage.tabs.audio'), icon: '🎵' },
        { id: 'notifications', label: t('settingsPage.tabs.notifications'), icon: '🔔' },
        { id: 'privacy', label: t('settingsPage.tabs.privacy'), icon: '🔒' },
        { id: 'about', label: t('settingsPage.tabs.about'), icon: 'ℹ️' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="settings-content">
                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">🌐</span>
                                {t('settingsPage.language.title')}
                            </h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <label className="setting-label">{t('settingsPage.language.label')}</label>
                                    <p className="setting-description">{t('settingsPage.language.description')}</p>
                                </div>
                                <div className="setting-control">
                                    <select 
                                        value={i18n.language} 
                                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                                        className="language-select"
                                    >
                                        <option value="en">{t('settingsPage.language.english')}</option>
                                        <option value="ru">{t('settingsPage.language.russian')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">💾</span>
                                {t('settingsPage.storage.title')}
                            </h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <label className="setting-label">{t('settingsPage.storage.cache')}</label>
                                    <p className="setting-description">{t('settingsPage.storage.cacheDescription')}</p>
                                </div>
                                <div className="setting-control">
                                    <button className="btn-secondary">
                                        {t('settingsPage.storage.clearCache')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="settings-content">
                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">🌙</span>
                                {t('settingsPage.appearance.title')}
                            </h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <label className="setting-label">{t('settingsPage.appearance.theme')}</label>
                                    <p className="setting-description">{t('settingsPage.appearance.themeDescription')}</p>
                                </div>
                                <div className="setting-control">
                                    <button 
                                        className="theme-toggle-btn" 
                                        onClick={handleThemeToggle}
                                        title={themeStore.isDark ? t('settingsPage.appearance.switchToLight') : t('settingsPage.appearance.switchToDark')}
                                    >
                                        <div className="theme-toggle-icon">
                                            {themeStore.isDark ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path 
                                                        d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2" 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path 
                                                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2" 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">🎨</span>
                                {t('settingsPage.appearance.accent')}
                            </h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <label className="setting-label">{t('settingsPage.appearance.accentColor')}</label>
                                    <p className="setting-description">{t('settingsPage.appearance.accentDescription')}</p>
                                </div>
                                <div className="setting-control">
                                    <div className="color-picker">
                                        {['#7289da', '#43b581', '#faa61a', '#f04747', '#9b59b6'].map((color) => (
                                            <button
                                                key={color}
                                                className="color-option"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'audio':
                return (
                    <div className="settings-content">
                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">🎤</span>
                                {t('settingsPage.audio.microphone')}
                            </h3>
                            <MicrophoneSettingsGroup />
                        </div>

                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">🔊</span>
                                {t('settingsPage.audio.speakers')}
                            </h3>
                            <AudioSettingsGroup />
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="settings-content">
                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">🔔</span>
                                {t('settingsPage.notifications.title')}
                            </h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <label className="setting-label">{t('settingsPage.notifications.enable')}</label>
                                    <p className="setting-description">{t('settingsPage.notifications.enableDescription')}</p>
                                </div>
                                <div className="setting-control">
                                    <label className="toggle-switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'privacy':
                return (
                    <div className="settings-content">
                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">🔒</span>
                                {t('settingsPage.privacy.title')}
                            </h3>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <label className="setting-label">{t('settingsPage.privacy.onlineStatus')}</label>
                                    <p className="setting-description">{t('settingsPage.privacy.onlineStatusDescription')}</p>
                                </div>
                                <div className="setting-control">
                                    <select className="privacy-select">
                                        <option value="online">{t('settingsPage.privacy.online')}</option>
                                        <option value="idle">{t('settingsPage.privacy.idle')}</option>
                                        <option value="dnd">{t('settingsPage.privacy.dnd')}</option>
                                        <option value="invisible">{t('settingsPage.privacy.invisible')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'about':
                return (
                    <div className="settings-content">
                        <div className="settings-section">
                            <h3 className="section-title">
                                <span className="section-icon">ℹ️</span>
                                {t('settingsPage.about.title')}
                            </h3>
                            <div className="about-content">
                                <div className="app-info">
                                    <div className="app-logo">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--accent-color)"/>
                                            <path d="M2 17L12 22L22 17" stroke="var(--accent-color)" strokeWidth="2"/>
                                            <path d="M2 12L12 17L22 12" stroke="var(--accent-color)" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <h2 className="app-name">ProjectVoice</h2>
                                    <p className="app-version">Version 1.0.0</p>
                                    <p className="app-description">
                                        Современная платформа для голосового и текстового общения
                                    </p>
                                </div>
                                
                                <div className="about-links">
                                    <button type="button" className="about-link">
                                        <span className="link-icon">📖</span>
                                        {t('settingsPage.about.documentation')}
                                    </button>
                                    <button type="button" className="about-link">
                                        <span className="link-icon">🐛</span>
                                        {t('settingsPage.about.reportBug')}
                                    </button>
                                    <button type="button" className="about-link">
                                        <span className="link-icon">💡</span>
                                        {t('settingsPage.about.suggestFeature')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t('settingsPage.back')}
                </button>
                <h1 className="settings-title">{t('settingsPage.title')}</h1>
            </div>

            <div className="settings-container">
                <div className="settings-sidebar">
                    <nav className="settings-nav">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span className="tab-label">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="settings-main">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
});

export default Settings;

