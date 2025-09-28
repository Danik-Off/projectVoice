import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { serverMembersService } from '../../../../services/serverMembersService';
import { ServerMember } from '../../../../types/server';
import ServerMembers from '../../../channelPage/components/channelSidebar/components/serverMembers/ServerMembers';
import serverStore from '../../../../store/serverStore';
import notificationStore from '../../../../store/NotificationStore';

const MembersSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const [members, setMembers] = useState<ServerMember[]>([]);
    const [loading, setLoading] = useState(false);

    const server = serverStore.currentServer;

    const loadMembers = useCallback(async () => {
        if (!server?.id) return;
        
        setLoading(true);
        try {
            const membersData = await serverMembersService.getServerMembers(server.id);
            setMembers(membersData);
        } catch (error) {
            console.error('Error loading members:', error);
        } finally {
            setLoading(false);
        }
    }, [server?.id]);

    const handleRoleChange = async (memberId: number, newRole: string) => {
        if (!server?.id) return;
        
        try {
            await serverMembersService.updateMemberRole(server.id, memberId, newRole);
            await loadMembers(); // Перезагружаем список участников
            
            notificationStore.addNotification(
                t('serverSettings.roleUpdated'),
                'success',
                3000
            );
        } catch (error) {
            console.error('Error updating member role:', error);
            notificationStore.addNotification(
                t('serverSettings.roleUpdateError'),
                'error',
                5000
            );
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!server?.id) return;
        
        try {
            await serverMembersService.removeMember(server.id, memberId);
            await loadMembers(); // Перезагружаем список участников
            
            notificationStore.addNotification(
                t('serverSettings.memberRemoved'),
                'success',
                3000
            );
        } catch (error) {
            console.error('Error removing member:', error);
            notificationStore.addNotification(
                t('serverSettings.memberRemoveError'),
                'error',
                5000
            );
        }
    };

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>{t('serverSettings.members')}</h2>
                <p>{t('serverSettings.membersDescription')}</p>
            </div>
            
            <div className="section-content">
                <div className="settings-card">
                    <div className="card-header">
                        <div className="header-content">
                            <div className="icon-container">
                                👥
                            </div>
                            <div className="header-text">
                                <h3>{t('serverSettings.serverMembers')}</h3>
                                <p>{t('serverSettings.serverMembersDescription')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-content">
                        {loading ? (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>{t('serverSettings.loadingMembers')}</p>
                            </div>
                        ) : (
                            <div className="server-members">
                                <ServerMembers 
                                    members={members}
                                    onRoleChange={handleRoleChange}
                                    onRemoveMember={handleRemoveMember}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MembersSettings;
