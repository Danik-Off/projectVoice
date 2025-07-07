import React from 'react';
import './Settings.scss';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../store/ThemeStore';

import AudioSettingsGroup from './audioSettings/audioSettings';
import MicrophoneSettingsGroup from './audioSettings/microphoneSettingsGroup';
import { useNavigate } from 'react-router-dom';

const Settings = observer(() => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const handleThemeToggle = () => {
        themeStore.toggleTheme();
    };

    return (
        <div className="settings-page">
            <h1 className="settings-title">
                <button className='button' onClick={() => navigate(-1)}>{t('settingsPage.buttonBack')}</button> {t('settingsPage.title')}
            </h1>

            <div className="settings-group">
                <h2 className="settings-group__title">{t('settingsPage.language.title')}</h2>
                <div className="settings-group__option">
                    <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
                        <option value="en">{t('settingsPage.language.english')}</option>
                        <option value="ru">{t('settingsPage.language.russian')}</option>
                    </select>
                </div>
            </div>

            <div className="settings-group">
                <h2 className="settings-group__title">{t('settingsPage.appearance.title')}</h2>
                <div className="settings-group__option">
                    <div className="theme-toggle-container">
                        <span className="theme-toggle-label">
                            {themeStore.isDark ? t('settingsPage.appearance.darkMode') : t('settingsPage.appearance.lightMode')}
                        </span>
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

            <div className="settings-group">
                <h2 className="settings-group__title">{t('settingsPage.audio.title')}</h2>
                <MicrophoneSettingsGroup></MicrophoneSettingsGroup>
                <AudioSettingsGroup></AudioSettingsGroup>
            </div>
        </div>
    );
});

export default Settings;

