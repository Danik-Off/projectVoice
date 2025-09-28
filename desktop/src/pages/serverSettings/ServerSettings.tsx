import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import serverStore from '../../store/serverStore';
import { authStore } from '../../store/authStore';
import { serverMembersService } from '../../services/serverMembersService';
import {
    ServerSettingsHeader,
    ServerSettingsNavigation,
    OverviewSettings,
    MembersSettings,
    RolesSettings,
    ChannelsSettings,
    DangerSettings,
    ServerSettingsTab
} from './components';

import './ServerSettings.scss';

const ServerSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const { serverId } = useParams<{ serverId: string }>();
    const [activeTab, setActiveTab] = useState<ServerSettingsTab>('overview');
    const [loading, setLoading] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<string>('member');

    const currentUser = authStore.user;
    const server = serverStore.currentServer;

    const loadServerData = useCallback(async () => {
        if (!serverId) return;
        
        setLoading(true);
        try {
            await serverStore.fetchServerById(parseInt(serverId));
            
            // Загружаем роль пользователя на сервере
            if (currentUser?.id) {
                const members = await serverMembersService.getServerMembers(parseInt(serverId));
                const userMember = members.find(member => member.userId === currentUser.id);
                setCurrentUserRole(userMember?.role || 'member');
            }
        } catch (error) {
            console.error('Error loading server data:', error);
        } finally {
            setLoading(false);
        }
    }, [serverId, currentUser?.id]);

    useEffect(() => {
        loadServerData();
    }, [loadServerData]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewSettings />;
            case 'members':
                return <MembersSettings />;
            case 'roles':
                return <RolesSettings />;
            case 'channels':
                return <ChannelsSettings />;
            case 'danger':
                return <DangerSettings />;
            default:
                return <OverviewSettings />;
        }
    };

    if (loading) {
        return (
            <div className="server-settings">
                <div className="loading">
                    <h2>{t('serverSettings.loading')}</h2>
                    <p>{t('serverSettings.loadingDescription')}</p>
                </div>
            </div>
        );
    }

    if (!server) {
        return (
            <div className="server-settings">
                <div className="error">
                    <h2>{t('serverSettings.error')}</h2>
                    <p>{t('serverSettings.serverNotFound')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="server-settings">
            <ServerSettingsHeader serverName={server.name} />
            
            <div className="settings-container">
                <ServerSettingsNavigation 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab}
                    currentUserRole={currentUserRole}
                />
                
                <div className="settings-main">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
});

export default ServerSettings;