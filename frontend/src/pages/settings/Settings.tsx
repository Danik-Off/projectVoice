import React from 'react';
import './Settings.scss';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className="settings-page">
            <h1 className="settings-title">{t('settingsPage.title')}</h1>

            {/* Language Settings */}
            <div className="settings-group">
                <h2 className="settings-group__title">{t('settingsPage.language.title')}</h2>
                <div className="settings-group__option">
                    <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
                        <option value="en">{t('settingsPage.language.english')}</option>
                        <option value="ru">{t('settingsPage.language.russian')}</option>
                    </select>
                </div>
            </div>

            {/* Audio Settings */}
            <div className="settings-group">
                <h2 className="settings-group__title">{t('settingsPage.audio.title')}</h2>

                <div className="settings-group__option">
                    <label htmlFor="microphone">{t('settingsPage.audio.microphone')}</label>
                    <select id="microphone">
                        <option value="default-mic">{t('settingsPage.audio.defaultMic')}</option>
                    </select>
                </div>

                <div className="settings-group__option">
                    <label htmlFor="speaker">{t('settingsPage.audio.speaker')}</label>
                    <select id="speaker">
                        <option value="default-speaker">{t('settingsPage.audio.defaultSpeaker')}</option>
                    </select>
                </div>

                <div className="settings-group__option">
                    <label htmlFor="volume">{t('settingsPage.audio.volume')}</label>
                    <input type="range" id="volume" min="0" max="100" value="50" />
                </div>

                <div className="settings-group__option">
                    <label htmlFor="mute">{t('settingsPage.audio.mute')}</label>
                    <input type="checkbox" id="mute" />
                </div>

                <div className="settings-group__option">
                    <button id="test-audio">{t('settingsPage.audio.testAudio')}</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
