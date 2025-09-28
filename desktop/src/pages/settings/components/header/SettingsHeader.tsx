import React from 'react';
import { useTranslation } from 'react-i18next';

const SettingsHeader: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="settings-header">
            <h1 className="settings-title">{t('settingsPage.title')}</h1>
            <div className="settings-notice">
                <div className="notice-icon">⚠️</div>
                <div className="notice-content">
                    <p className="notice-text">
                        Некоторые настройки могут пока не работать, так как проект находится в активной разработке
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingsHeader;
