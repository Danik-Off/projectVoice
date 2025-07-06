import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import serverStore from '../../store/serverStore';
import { authStore } from '../../store/authStore';
import { serverMembersService } from '../../services/serverMembersService';
import ServerMembers from '../channelPage/components/channelSidebar/components/serverMembers/ServerMembers';
import './ServerSettings.scss';

const ServerSettings: React.FC = observer(() => {
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

    // Отладочная информация для пользователя
    console.log('ServerSettings - currentUser:', currentUser);
    console.log('ServerSettings - authStore.isAuthenticated:', authStore.isAuthenticated);
    console.log('ServerSettings - authStore.token:', authStore.getToken());

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
        } finally {
            setLoading(false);
        }
    }, [serverId]);

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
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого участника из сервера?')) {
            return;
        }

        try {
            await serverMembersService.removeMember(parseInt(serverId!), memberId);
            await loadServerData(); // Перезагружаем данные
        } catch (error) {
            console.error('Ошибка удаления участника:', error);
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
        navigate(`/channel/${serverId}`);
    };

    if (loading) {
        return (
            <div className="server-settings">
                <div className="loading">Загрузка настроек сервера...</div>
            </div>
        );
    }

    if (!server) {
        return (
            <div className="server-settings">
                <div className="error">Сервер не найден</div>
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
                <div className="error">У вас нет прав для управления этим сервером</div>
            </div>
        );
    }

    return (
        <div className="server-settings">
            <div className="settings-header">
                <button className="back-button" onClick={handleBackToServer}>
                    ← Назад к серверу
                </button>
                <h1>Настройки сервера: {server.name}</h1>
            </div>

            <div className="settings-content">
                <div className="settings-sidebar">
                    <nav className="settings-nav">
                        <button 
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Обзор
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'members' ? 'active' : ''}`}
                            onClick={() => setActiveTab('members')}
                        >
                            Участники
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`}
                            onClick={() => setActiveTab('roles')}
                        >
                            Роли
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'channels' ? 'active' : ''}`}
                            onClick={() => setActiveTab('channels')}
                        >
                            Каналы
                        </button>
                        {currentUserRole === 'owner' && (
                            <button 
                                className={`nav-item ${activeTab === 'danger' ? 'active' : ''}`}
                                onClick={() => setActiveTab('danger')}
                            >
                                Опасная зона
                            </button>
                        )}
                    </nav>
                </div>

                <div className="settings-main">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <h2>Обзор сервера</h2>
                            {isEditing ? (
                                <div className="edit-form">
                                    <div className="form-group">
                                        <label htmlFor="server-name">Название сервера:</label>
                                        <input
                                            id="server-name"
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Введите название сервера"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="server-description">Описание:</label>
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
                                            Сохранить
                                        </button>
                                        <button className="cancel-button" onClick={handleCancelEdit}>
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="server-info">
                                    <div className="info-item">
                                        <label>Название сервера:</label>
                                        <span>{server.name}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Описание:</label>
                                        <span>{server.description || 'Описание отсутствует'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Количество участников:</label>
                                        <span>{members.length}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Количество каналов:</label>
                                        <span>{server.channels?.length || 0}</span>
                                    </div>
                                    <div className="edit-actions">
                                        <button className="edit-button" onClick={handleEditServer}>
                                            Редактировать сервер
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="members-tab">
                            <h2>Управление участниками</h2>
                            <ServerMembers 
                                members={members}
                                onRoleChange={handleRoleChange}
                                onRemoveMember={handleRemoveMember}
                            />
                        </div>
                    )}

                    {activeTab === 'roles' && (
                        <div className="roles-tab">
                            <h2>Роли сервера</h2>
                            <div className="roles-info">
                                <div className="role-item">
                                    <h3>👑 Владелец</h3>
                                    <p>Полный контроль над сервером, включая удаление сервера</p>
                                </div>
                                <div className="role-item">
                                    <h3>⚡ Администратор</h3>
                                    <p>Управление участниками, каналами и настройками сервера</p>
                                </div>
                                <div className="role-item">
                                    <h3>🛡️ Модератор</h3>
                                    <p>Управление участниками и модерация каналов</p>
                                </div>
                                <div className="role-item">
                                    <h3>👤 Участник</h3>
                                    <p>Обычный участник сервера</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'channels' && (
                        <div className="channels-tab">
                            <h2>Каналы сервера</h2>
                            <div className="channels-list">
                                {server.channels?.map((channel: any) => (
                                    <div key={channel.id} className="channel-item">
                                        <span className="channel-icon">
                                            {channel.type === 'text' ? '#' : '🔊'}
                                        </span>
                                        <span className="channel-name">{channel.name}</span>
                                        <span className="channel-type">{channel.type}</span>
                                    </div>
                                )) || <p>Каналы не найдены</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'danger' && currentUserRole === 'owner' && (
                        <div className="danger-tab">
                            <h2>Опасная зона</h2>
                            <div className="danger-actions">
                                <div className="danger-item">
                                    <h3>Удалить сервер</h3>
                                    <p>Это действие нельзя отменить. Все данные сервера будут удалены навсегда.</p>
                                    <button 
                                        className="danger-button"
                                        onClick={() => {
                                            if (window.confirm('Вы уверены, что хотите удалить этот сервер? Это действие нельзя отменить.')) {
                                                // TODO: Добавить логику удаления сервера
                                                console.log('Удаление сервера');
                                            }
                                        }}
                                    >
                                        Удалить сервер
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