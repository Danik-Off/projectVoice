import React from 'react';
import { useTranslation } from 'react-i18next';

export type SettingsTab = 'profile' | 'general' | 'appearance' | 'audio' | 'notifications' | 'privacy' | 'about';

interface SettingsNavigationProps {
    activeTab: SettingsTab;
    onTabChange: (tab: SettingsTab) => void;
}

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({ activeTab, onTabChange }) => {
    const { t } = useTranslation();

    const tabs: Array<{ id: SettingsTab; label: string; icon: string }> = [
        { id: 'profile', label: t('settingsPage.tabs.profile'), icon: '👤' },
        { id: 'general', label: t('settingsPage.tabs.general'), icon: '⚙️' },
        { id: 'appearance', label: t('settingsPage.tabs.appearance'), icon: '🎨' },
        { id: 'audio', label: t('settingsPage.tabs.audio'), icon: '🎵' },
        { id: 'notifications', label: t('settingsPage.tabs.notifications'), icon: '🔔' },
        { id: 'privacy', label: t('settingsPage.tabs.privacy'), icon: '🔒' },
        { id: 'about', label: t('settingsPage.tabs.about'), icon: 'ℹ️' },
    ];

    return (
        <div className="settings-sidebar">
            <nav className="settings-nav">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default SettingsNavigation;
