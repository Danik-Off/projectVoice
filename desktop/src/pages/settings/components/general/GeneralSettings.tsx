import React from 'react';
import { useTranslation } from 'react-i18next';

const GeneralSettings: React.FC = () => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('settingsPage.general.title')}</h2>
                <p>{t('settingsPage.general.description')}</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                🌐
                            </div>
                            <div className="header-text">
                                <h3>{t('settingsPage.general.language.title')}</h3>
                                <p>{t('settingsPage.general.language.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        <div className="setting-group">
                            <label className="setting-label">
                                <span>{t('settingsPage.general.language.label')}</span>
                            </label>
                            <div className="setting-control">
                                <select 
                                    className="settings-select" 
                                    value={i18n.language}
                                    onChange={handleLanguageChange}
                                >
                                    <option value="ru">{t('settingsPage.general.language.russian')}</option>
                                    <option value="en">{t('settingsPage.general.language.english')}</option>
                                </select>
                                <div className="setting-description">
                                    {t('settingsPage.general.language.description')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;



