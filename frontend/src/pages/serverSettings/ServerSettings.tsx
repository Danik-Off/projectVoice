import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import serverStore from '../../store/serverStore';
import { authStore } from '../../store/authStore';
import { serverMembersService } from '../../services/serverMembersService';
import ServerMembers from '../channelPage/components/channelSidebar/components/serverMembers/ServerMembers';
import notificationStore from '../../store/NotificationStore';
import './ServerSettings.scss';

const ServerSettings: React.FC = observer(() => {
    const { t } = useTranslation();
    const { serverId } = useParams<{ serverId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: ''
    });

    const currentUser = authStore.user;
    const server = serverStore.currentServer;



    const loadServerData = useCallback(async () => {
        if (!serverId) return;
        
        setLoading(true);
        try {
            // Загружаем данные сервера
            await serverStore.fetchServerById(parseInt(serverId));

            // Загружаем участников сервера
            const membersData = await serverMembersService.getServerMembers(parseInt(serverId));

            setMembers(membersData);
            
        } catch (error) {
            console.error('Ошибка загрузки данных сервера:', error);
            notificationStore.addNotification(t('notifications.serverLoadError'), 'error');
        } finally {
            setLoading(false);
        }
    }, [serverId, t]);

    useEffect(() => {
        if (serverId) {
            loadServerData();
        }
    }, [serverId, loadServerData]);

    // Загружаем данные пользователя при монтировании компонента
    useEffect(() => {
        if (!currentUser && authStore.isAuthenticated) {
            authStore.loadUserData();
        }
    }, [currentUser]);

    // Обновляем форму редактирования при изменении сервера
    useEffect(() => {
        if (server) {
            setEditForm({
                name: server.name || '',
                description: server.description || ''
            });
        }
    }, [server]);

    const handleRoleChange = async (memberId: number, newRole: string) => {
        try {
            await serverMembersService.updateMemberRole(parseInt(serverId!), memberId, newRole);
            await loadServerData(); // Перезагружаем данные
        } catch (error) {
            console.error('Ошибка изменения роли:', error);
            notificationStore.addNotification(t('notifications.roleChangeError'), 'error');
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!window.confirm(t('serverMembers.removeConfirm'))) {
            return;
        }

        try {
            await serverMembersService.removeMember(parseInt(serverId!), memberId);
            await loadServerData(); // Перезагружаем данные
        } catch (error) {
            console.error('Ошибка удаления участника:', error);
            notificationStore.addNotification(t('notifications.memberRemoveError'), 'error');
        }
    };

    const handleEditServer = () => {
        setIsEditing(true);
    };

    const handleSaveServer = async () => {
        if (!serverId) return;

        try {
            await serverStore.updateServer(parseInt(serverId), editForm);
            await loadServerData(); // Перезагружаем данные
            setIsEditing(false);
        } catch (error) {
            console.error('Ошибка обновления сервера:', error);
            notificationStore.addNotification(t('notifications.serverUpdateError'), 'error');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Восстанавливаем исходные значения
        if (server) {
            setEditForm({
                name: server.name || '',
                description: server.description || ''
            });
        }
    };

    const handleBackToServer = () => {
        navigate(`/server/${serverId}`);
    };

    const handleDeleteServer = async () => {
        if (!serverId) return;

        if (!window.confirm(t('serverSettings.dangerTab.deleteServer.confirmMessage'))) {
            return;
        }

        try {
            await serverStore.deleteServer(parseInt(serverId));
            // Обновляем список серверов после удаления
            await serverStore.fetchServers();
            notificationStore.addNotification(t('notifications.serverDeleted'), 'info');
            navigate('/'); // Перенаправляем на главную страницу
        } catch (error) {
            console.error('Ошибка удаления сервера:', error);
            notificationStore.addNotification(t('notifications.serverDeleteError'), 'error');
        }
    };

    if (!authStore.isAuthenticated) {
        return (
            <div className="server-settings">
                <div className="error">
                    <h2>{t('serverSettings.authRequired.title')}</h2>
                    <p>{t('serverSettings.authRequired.message')}</p>
                    <button onClick={() => navigate('/auth')} className="back-button">
                        {t('serverSettings.authRequired.loginButton')}
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="server-settings">
                <div className="loading">{t('serverSettings.loading')}</div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="server-settings">
                <div className="loading">{t('serverSettings.loadingUser')}</div>
            </div>
        );
    }

    if (!server) {
        return (
            <div className="server-settings">
                <div className="error">{t('serverSettings.serverNotFound')}</div>
            </div>
        );
    }

    // Проверяем права пользователя
    const currentUserId = currentUser?.id;
    const isOwner = server?.ownerId === currentUserId;
    const currentUserMember = members.find(member => member.userId === currentUserId);
    const currentUserRole = currentUserMember?.role || (isOwner ? 'owner' : 'member');
    const canManageServer = ['owner', 'admin'].includes(currentUserRole);

    if (!canManageServer) {
        return (
            <div className="server-settings">
                <div className="error">
                    <h2>Доступ запрещен</h2>
                    <p>У вас нет прав для управления этим сервером.</p>
                    <p>Ваша роль: {currentUserRole}</p>
                    <button onClick={handleBackToServer} className="back-button">
                        Вернуться к серверу
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="server-settings">
            <div className="settings-header">
                <button className="back-button" onClick={handleBackToServer}>
                    {t('serverSettings.backToServer')}
                </button>
                <h1>{t('serverSettings.title')}: {server.name}</h1>
            </div>

            <div className="settings-content">
                <div className="settings-sidebar">
                    <nav className="settings-nav">
                        <button 
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            {t('serverSettings.overview')}
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'members' ? 'active' : ''}`}
                            onClick={() => setActiveTab('members')}
                        >
                            {t('serverSettings.members')}
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`}
                            onClick={() => setActiveTab('roles')}
                        >
                            {t('serverSettings.roles')}
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'channels' ? 'active' : ''}`}
                            onClick={() => setActiveTab('channels')}
                        >
                            {t('serverSettings.channels')}
                        </button>
                        {currentUserRole === 'owner' && (
                            <button 
                                className={`nav-item ${activeTab === 'danger' ? 'active' : ''}`}
                                onClick={() => setActiveTab('danger')}
                            >
                                {t('serverSettings.dangerZone')}
                            </button>
                        )}
                    </nav>
                </div>

                <div className="settings-main">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <h2>{t('serverSettings.overviewTab.title')}</h2>
                            {isEditing ? (
                                <div className="edit-form">
                                    <div className="form-group">
                                        <label htmlFor="server-name">{t('serverSettings.overviewTab.serverName')}</label>
                                        <input
                                            id="server-name"
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Введите название сервера"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="server-description">{t('serverSettings.overviewTab.description')}</label>
                                        <textarea
                                            id="server-description"
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Введите описание сервера"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button className="save-button" onClick={handleSaveServer}>
                                            {t('serverSettings.overviewTab.save')}
                                        </button>
                                        <button className="cancel-button" onClick={handleCancelEdit}>
                                            {t('serverSettings.overviewTab.cancel')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="server-info">
                                    <div className="info-item">
                                        <label>{t('serverSettings.overviewTab.serverName')}</label>
                                        <span>{server.name}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>{t('serverSettings.overviewTab.description')}</label>
                                        <span>{server.description || t('serverSettings.overviewTab.noDescription')}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>{t('serverSettings.overviewTab.membersCount')}</label>
                                        <span>{members.length}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>{t('serverSettings.overviewTab.channelsCount')}</label>
                                        <span>{server.channels?.length || 0}</span>
                                    </div>
                                    <div className="edit-actions">
                                        <button className="edit-button" onClick={handleEditServer}>
                                            {t('serverSettings.overviewTab.editServer')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="members-tab">
                            <h2>{t('serverSettings.membersTab.title')}</h2>
                            <div className="debug-info">
                                <p>{t('serverSettings.membersTab.membersCount')} {members.length}</p>
                                <p>{t('serverSettings.membersTab.membersData')} {JSON.stringify(members, null, 2)}</p>
                            </div>
                            <ServerMembers 
                                members={members}
                                onRoleChange={handleRoleChange}
                                onRemoveMember={handleRemoveMember}
                            />
                        </div>
                    )}

                    {activeTab === 'roles' && (
                        <div className="roles-tab">
                            <h2>{t('serverSettings.rolesTab.title')}</h2>
                            <div className="roles-info">
                                <div className="role-item">
                                    <h3>{t('serverSettings.rolesTab.owner.title')}</h3>
                                    <p>{t('serverSettings.rolesTab.owner.description')}</p>
                                </div>
                                <div className="role-item">
                                    <h3>{t('serverSettings.rolesTab.admin.title')}</h3>
                                    <p>{t('serverSettings.rolesTab.admin.description')}</p>
                                </div>
                                <div className="role-item">
                                    <h3>{t('serverSettings.rolesTab.moderator.title')}</h3>
                                    <p>{t('serverSettings.rolesTab.moderator.description')}</p>
                                </div>
                                <div className="role-item">
                                    <h3>{t('serverSettings.rolesTab.member.title')}</h3>
                                    <p>{t('serverSettings.rolesTab.member.description')}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'channels' && (
                        <div className="channels-tab">
                            <h2>{t('serverSettings.channelsTab.title')}</h2>
                            <div className="channels-list">
                                {server.channels?.map((channel: any) => (
                                    <div key={channel.id} className="channel-item">
                                        <span className="channel-icon">
                                            {channel.type === 'text' ? '#' : '🔊'}
                                        </span>
                                        <span className="channel-name">{channel.name}</span>
                                        <span className="channel-type">{channel.type}</span>
                                    </div>
                                )) || <p>{t('serverSettings.channelsTab.noChannels')}</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'danger' && currentUserRole === 'owner' && (
                        <div className="danger-tab">
                            <h2>{t('serverSettings.dangerTab.title')}</h2>
                            <div className="danger-actions">
                                <div className="danger-item">
                                    <h3>{t('serverSettings.dangerTab.deleteServer.title')}</h3>
                                    <p>{t('serverSettings.dangerTab.deleteServer.description')}</p>
                                    <button 
                                        className="danger-button"
                                        onClick={handleDeleteServer}
                                    >
                                        {t('serverSettings.dangerTab.deleteServer.button')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default ServerSettings; 