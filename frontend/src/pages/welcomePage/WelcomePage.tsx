// src/components/WelcomePage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './WelcomePage.scss';

const WelcomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="welcome-page">
            <div className="welcome-content">
                <div className="welcome-header">
                    <div className="welcome-logo">
                        <span className="welcome-logo-icon">🎙️</span>
                        <h1 className="welcome-title">ProjectVoice</h1>
                    </div>
                    <p className="welcome-subtitle">{t('welcome.subtitle')}</p>
                </div>
                
                <div className="welcome-features">
                    <div className="feature-card">
                        <div className="feature-icon">🔊</div>
                        <h3>{t('welcome.features.voice.title')}</h3>
                        <p>{t('welcome.features.voice.description')}</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>{t('welcome.features.community.title')}</h3>
                        <p>{t('welcome.features.community.description')}</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>{t('welcome.features.privacy.title')}</h3>
                        <p>{t('welcome.features.privacy.description')}</p>
                    </div>
                </div>
                
                <div className="welcome-footer">
                    <p className="welcome-message">{t('welcome.message')}</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
