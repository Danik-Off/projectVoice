import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacySettings: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('settingsPage.privacy.title')}</h2>
                <p>{t('settingsPage.privacy.description')}</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                👁️
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.privacy.onlineStatus.title')}</h3>
                                <p>{t('settingsPage.privacy.onlineStatus.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.privacy.onlineStatus.visibility')}</span>
                            </label>
                            <div className="setting-control">
                                <select className="settings-select" defaultValue="friends">
                                    <option value="everyone">{t('settingsPage.privacy.onlineStatus.options.everyone')}</option>
                                    <option value="friends">{t('settingsPage.privacy.onlineStatus.options.friends')}</option>
                                    <option value="none">{t('settingsPage.privacy.onlineStatus.options.none')}</option>
                                </select>
                                <div className="setting-description">
                                    {t('settingsPage.privacy.onlineStatus.visibilityDescription')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.privacy.onlineStatus.showActivity')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">{t('settingsPage.privacy.enabled')}</span>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.privacy.onlineStatus.showActivityDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🔒
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.privacy.security.title')}</h3>
                                <p>{t('settingsPage.privacy.security.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.privacy.security.twoFactor')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">{t('settingsPage.privacy.disabled')}</span>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.privacy.security.twoFactorDescription')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.privacy.security.loginNotifications')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-switch"></span>
                                    <span className="toggle-label">{t('settingsPage.privacy.enabled')}</span>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.privacy.security.loginNotificationsDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;
