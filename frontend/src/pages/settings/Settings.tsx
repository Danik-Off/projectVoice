import React, { useState } from 'react';
import './Settings.scss';
import { observer } from 'mobx-react-lite';
import {
    SettingsHeader,
    SettingsNavigation,
    GeneralSettings,
    AppearanceSettings,
    NotificationsSettings,
    PrivacySettings,
    AboutSettings,
    SettingsTab
} from './components';
import AudioSettings from './components/audioSettings/AudioSettings';

const Settings = observer(() => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'appearance':
                return <AppearanceSettings />;
            case 'audio':
                return <AudioSettings />;
            case 'notifications':
                return <NotificationsSettings />;
            case 'privacy':
                return <PrivacySettings />;
            case 'about':
                return <AboutSettings />;
            default:
                return null;
        }
    };

    return (
        <div className="settings-page">
            <SettingsHeader />
            
            <div className="settings-container">
                <SettingsNavigation 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                />
                
                <div className="settings-main">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
});

export default Settings;

