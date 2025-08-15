import React from 'react';
import { useTranslation } from 'react-i18next';
import versionInfo from '../../../../version.json';

const AboutSettings: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('settingsPage.about.title')}</h2>
                <p>{t('settingsPage.about.description')}</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🎯
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.about.appInfo.title')}</h3>
                                <p>{t('settingsPage.about.appInfo.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="settings-info">
                            <div className="info-header">
                                <h4>{t('settingsPage.about.appInfo.infoTitle')}</h4>
                            </div>
                            <div className="info-content">
                                <div className="info-row">
                                    <span className="info-label">{t('settingsPage.about.appInfo.version')}</span>
                                    <span className="info-value">{versionInfo.version}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">{t('settingsPage.about.appInfo.build')}</span>
                                    <span className="info-value">{versionInfo.buildDate} ({versionInfo.gitHash})</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">{t('settingsPage.about.appInfo.developer')}</span>
                                    <span className="info-value">Danik Off</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">{t('settingsPage.about.appInfo.license')}</span>
                                    <span className="info-value">MIT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                📖
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.about.descriptionSection.title')}</h3>
                                <p>{t('settingsPage.about.descriptionSection.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <div className="setting-control">
                                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                    {t('settingsPage.about.descriptionSection.content')}
                                </p>
                                <div className="setting-description">
                                    {t('settingsPage.about.descriptionSection.note')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🔗
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.about.links.title')}</h3>
                                <p>{t('settingsPage.about.links.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.about.links.documentation')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-grid two-columns">
                                    <button className="settings-button secondary">
                                        {t('settingsPage.about.links.guide')}
                                    </button>
                                    <button className="settings-button secondary">
                                        {t('settingsPage.about.links.bugReport')}
                                    </button>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.about.links.guideDescription')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.about.links.community')}</span>
                            </label>
                            <div className="setting-control">
                                <div className="settings-grid three-columns">
                                    <button className="settings-button secondary">
                                        {t('settingsPage.about.links.telegram')}
                                    </button>
                                    <button className="settings-button secondary">
                                        {t('settingsPage.about.links.vk')}
                                    </button>
                                    <button className="settings-button secondary">
                                        {t('settingsPage.about.links.github')}
                                    </button>
                                </div>
                                <div className="setting-description">
                                    {t('settingsPage.about.links.communityDescription')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                ⚙️
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.about.technical.title')}</h3>
                                <p>{t('settingsPage.about.technical.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="settings-info">
                            <div className="info-header">
                                <h4>{t('settingsPage.about.technical.technologies')}</h4>
                            </div>
                            <div className="info-content">
                                <div className="info-row">
                                    <span className="info-label">{t('settingsPage.about.technical.frontend')}</span>
                                    <span className="info-value">React + TypeScript</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">{t('settingsPage.about.technical.backend')}</span>
                                    <span className="info-value">Node.js + Express</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">{t('settingsPage.about.technical.webrtc')}</span>
                                    <span className="info-value">Peer-to-peer</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">{t('settingsPage.about.technical.database')}</span>
                                    <span className="info-value">SQLite</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSettings;
