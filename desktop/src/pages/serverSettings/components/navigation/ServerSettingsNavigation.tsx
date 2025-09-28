import React from 'react';
import { useTranslation } from 'react-i18next';
import './ServerSettingsNavigation.scss';

export type ServerSettingsTab = 'overview' | 'members' | 'roles' | 'channels' | 'danger';

interface ServerSettingsNavigationProps {
    activeTab: ServerSettingsTab;
    onTabChange: (tab: ServerSettingsTab) => void;
    currentUserRole: string;
}

const ServerSettingsNavigation: React.FC<ServerSettingsNavigationProps> = ({ 
    activeTab, 
    onTabChange, 
    currentUserRole 
}) => {
    const { t } = useTranslation();

    const tabs: Array<{ id: ServerSettingsTab; label: string; icon: string; requiredRole?: string }> = [
        { id: 'overview', label: t('serverSettings.overview'), icon: '📊' },
        { id: 'members', label: t('serverSettings.members'), icon: '👥' },
        { id: 'roles', label: t('serverSettings.roles'), icon: '🎭' },
        { id: 'channels', label: t('serverSettings.channels'), icon: '📝' },
        { 
            id: 'danger', 
            label: t('serverSettings.danger'), 
            icon: '⚠️',
            requiredRole: 'owner'
        },
    ];

    const filteredTabs = tabs.filter(tab => 
        !tab.requiredRole || 
        (tab.requiredRole === 'owner' && currentUserRole === 'owner')
    );

    return (
        <div className="settings-sidebar">
            <nav className="settings-nav">
                {filteredTabs.map((tab) => (
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

export default ServerSettingsNavigation;
