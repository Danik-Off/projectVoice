import React from 'react';
import { useTranslation } from 'react-i18next';

const NotificationsSettings: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('settingsPage.notifications.title')}</h2>
                <p>{t('settingsPage.notifications.description')}</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🔔
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.notifications.general.title')}</h3>
                                <p>{t('settingsPage.notifications.general.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.notifications.general.enable')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">{t('settingsPage.notifications.enabled')}</span>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.notifications.general.enableDescription')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.notifications.general.sound')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">{t('settingsPage.notifications.enabled')}</span>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.notifications.general.soundDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                💬
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.notifications.chat.title')}</h3>
                                <p>{t('settingsPage.notifications.chat.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.notifications.chat.newMessages')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">{t('settingsPage.notifications.enabled')}</span>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.notifications.chat.newMessagesDescription')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.notifications.chat.mentions')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">{t('settingsPage.notifications.enabled')}</span>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.notifications.chat.mentionsDescription')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.notifications.chat.voiceCalls')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">{t('settingsPage.notifications.enabled')}</span>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.notifications.chat.voiceCallsDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSettings;
