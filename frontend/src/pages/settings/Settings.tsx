import React from 'react';
import './Settings.scss';
import { useTranslation } from 'react-i18next';
import AudioSettingsGroup from './audioSettings/audioSettings';
import MicrophoneSettingsGroup from './audioSettings/microphoneSettingsGroup';

const Settings = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className="settings-page">
            <h1 className="settings-title">{t('settingsPage.title')}</h1>
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
                <h2 className="settings-group__title">{t('settingsPage.audio.title')}</h2>
                <MicrophoneSettingsGroup></MicrophoneSettingsGroup>
                <AudioSettingsGroup></AudioSettingsGroup>
            </div>
        </div>
    );
};

export default Settings;
