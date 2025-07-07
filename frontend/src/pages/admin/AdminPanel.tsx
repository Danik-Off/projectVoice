import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { adminService } from '../../services/adminService';
import { authStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import './AdminPanel.scss';

interface Stats {
    users: {
        total: number;
        active: number;
        blocked: number;
        byRole: {
            admin: number;
            moderator: number;
            user: number;
        };
    };
    servers: {
        total: number;
        withChannels: number;
    };
    channels: {
        total: number;
        text: number;
        voice: number;
    };
    messages: {
        total: number;
        today: number;
    };
}

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}

interface Server {
    id: number;
    name: string;
    description?: string;
    ownerId: number;
    createdAt: string;
    channels?: any[];
    memberCount?: number;
}

const AdminPanel: React.FC = observer(() => {
    const { t } = useTranslation();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [servers, setServers] = useState<Server[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [logs, setLogs] = useState<any>(null);

    const loadStats = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            const response = await adminService.getUsers({
                page: currentPage,
                search: searchTerm,
                role: roleFilter,
                status: statusFilter
            });
            setUsers(response.users);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
        }
    }, [currentPage, searchTerm, roleFilter, statusFilter]);

    const loadServers = useCallback(async () => {
        try {
            const response = await adminService.getServers();
            setServers(response.servers);
        } catch (error) {
            console.error('Ошибка загрузки серверов:', error);
        }
    }, []);

    const loadLogs = useCallback(async () => {
        try {
            const response = await adminService.getLogs();
            setLogs(response);
        } catch (error) {
            console.error('Ошибка загрузки логов:', error);
        }
    }, []);

    useEffect(() => {
        if (authStore.user?.role !== 'admin') {
            window.location.href = '/';
            return;
        }

        loadStats();
    }, [loadStats]);

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'servers') {
            loadServers();
        } else if (activeTab === 'logs') {
            loadLogs();
        }
    }, [activeTab, loadUsers, loadServers, loadLogs]);

    const updateUser = async (userId: number, updates: any) => {
        try {
            await adminService.updateUser(userId, updates);
            loadUsers(); // Перезагружаем список
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
        }
    };

    const deleteUser = async (userId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await adminService.deleteUser(userId);
                loadUsers(); // Перезагружаем список
            } catch (error) {
                console.error('Ошибка удаления пользователя:', error);
            }
        }
    };

    const deleteServer = async (serverId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот сервер?')) {
            try {
                await adminService.deleteServer(serverId);
                loadServers(); // Перезагружаем список
            } catch (error) {
                console.error('Ошибка удаления сервера:', error);
            }
        }
    };

    const getRoleBadge = (role: string) => {
        const roleColors = {
            admin: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            moderator: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
            user: 'linear-gradient(135deg, var(--accent-color) 0%, var(--button-bg) 100%)'
        };

        return (
            <span 
                className="role-badge"
                style={{ background: roleColors[role as keyof typeof roleColors] }}
            >
                {role}
            </span>
        );
    };

    const getStatusBadge = (isActive: boolean) => {
        return (
            <span 
                className={`status-badge ${isActive ? 'active' : 'blocked'}`}
                style={{
                    background: isActive 
                        ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
                        : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                }}
            >
                {isActive ? 'Активен' : 'Заблокирован'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="admin-panel">
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    Загрузка админ-панели...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>🚀 Админ-панель ProjectVoice</h1>
                <div className="admin-user-info">
                    <span>👤 Администратор: {authStore.user?.username}</span>
                    <button onClick={() => authStore.logout()} className="logout-btn">
                        🚪 Выйти
                    </button>
                </div>
            </div>

            <div className="admin-nav">
                <button 
                    className={activeTab === 'dashboard' ? 'active' : ''}
                    onClick={() => setActiveTab('dashboard')}
                >
                    📊 Дашборд
                </button>
                <button 
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Пользователи
                </button>
                <button 
                    className={activeTab === 'servers' ? 'active' : ''}
                    onClick={() => setActiveTab('servers')}
                >
                    🏠 Серверы
                </button>
                <button 
                    className={activeTab === 'logs' ? 'active' : ''}
                    onClick={() => setActiveTab('logs')}
                >
                    📝 Логи
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'dashboard' && (
                    <div className="dashboard">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>👥 Пользователи</h3>
                                <div className="stat-numbers">
                                    <div className="stat-main">{stats?.users.total || 0}</div>
                                    <div className="stat-details">
                                        <span>✅ Активных: {stats?.users.active || 0}</span>
                                        <span>❌ Заблокированных: {stats?.users.blocked || 0}</span>
                                    </div>
                                </div>
                                <div className="stat-breakdown">
                                    <div>👑 Админов: {stats?.users.byRole.admin || 0}</div>
                                    <div>🛡️ Модераторов: {stats?.users.byRole.moderator || 0}</div>
                                    <div>👤 Пользователей: {stats?.users.byRole.user || 0}</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3>🏠 Серверы</h3>
                                <div className="stat-numbers">
                                    <div className="stat-main">{stats?.servers.total || 0}</div>
                                    <div className="stat-details">
                                        <span>📢 С каналами: {stats?.servers.withChannels || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3>📢 Каналы</h3>
                                <div className="stat-numbers">
                                    <div className="stat-main">{stats?.channels.total || 0}</div>
                                    <div className="stat-details">
                                        <span>💬 Текстовых: {stats?.channels.text || 0}</span>
                                        <span>🎤 Голосовых: {stats?.channels.voice || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3>💬 Сообщения</h3>
                                <div className="stat-numbers">
                                    <div className="stat-main">{stats?.messages.total || 0}</div>
                                    <div className="stat-details">
                                        <span>📅 Сегодня: {stats?.messages.today || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <h3>⚡ Быстрые действия</h3>
                            <div className="action-buttons">
                                <button onClick={() => setActiveTab('users')}>
                                    👥 Управление пользователями
                                </button>
                                <button onClick={() => setActiveTab('servers')}>
                                    🏠 Просмотр серверов
                                </button>
                                <button onClick={loadStats}>
                                    🔄 Обновить статистику
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-management">
                        <h2>👥 Управление пользователями</h2>
                        <UsersManagement 
                            users={users}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            searchTerm={searchTerm}
                            roleFilter={roleFilter}
                            statusFilter={statusFilter}
                            onSearchChange={setSearchTerm}
                            onRoleFilterChange={setRoleFilter}
                            onStatusFilterChange={setStatusFilter}
                            onPageChange={setCurrentPage}
                            onUpdateUser={updateUser}
                            onDeleteUser={deleteUser}
                            getRoleBadge={getRoleBadge}
                            getStatusBadge={getStatusBadge}
                        />
                    </div>
                )}

                {activeTab === 'servers' && (
                    <div className="servers-management">
                        <h2>🏠 Управление серверами</h2>
                        <ServersManagement 
                            servers={servers}
                            onDeleteServer={deleteServer}
                        />
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="logs-viewer">
                        <h2>📝 Системные логи</h2>
                        <LogsViewer logs={logs} />
                    </div>
                )}
            </div>
        </div>
    );
});

// Компонент управления пользователями
const UsersManagement: React.FC<{
    users: User[];
    currentPage: number;
    totalPages: number;
    searchTerm: string;
    roleFilter: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onRoleFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onUpdateUser: (userId: number, updates: any) => void;
    onDeleteUser: (userId: number) => void;
    getRoleBadge: (role: string) => JSX.Element;
    getStatusBadge: (isActive: boolean) => JSX.Element;
}> = ({ 
    users, 
    currentPage, 
    totalPages, 
    searchTerm, 
    roleFilter, 
    statusFilter,
    onSearchChange,
    onRoleFilterChange,
    onStatusFilterChange,
    onPageChange,
    onUpdateUser,
    onDeleteUser,
    getRoleBadge,
    getStatusBadge
}) => {
    return (
        <>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Поиск по имени или email..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <select value={roleFilter} onChange={(e) => onRoleFilterChange(e.target.value)}>
                    <option value="">Все роли</option>
                    <option value="admin">Админ</option>
                    <option value="moderator">Модератор</option>
                    <option value="user">Пользователь</option>
                </select>
                <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
                    <option value="">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="blocked">Заблокированные</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя пользователя</th>
                            <th>Email</th>
                            <th>Роль</th>
                            <th>Статус</th>
                            <th>Дата регистрации</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>{getStatusBadge(user.isActive)}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => onUpdateUser(user.id, { role: e.target.value })}
                                    >
                                        <option value="user">Пользователь</option>
                                        <option value="moderator">Модератор</option>
                                        <option value="admin">Админ</option>
                                    </select>
                                    <button
                                        onClick={() => onUpdateUser(user.id, { isActive: !user.isActive })}
                                        className={`status-toggle ${user.isActive ? 'block' : 'unblock'}`}
                                    >
                                        {user.isActive ? '🚫 Заблокировать' : '✅ Разблокировать'}
                                    </button>
                                    <button
                                        onClick={() => onDeleteUser(user.id)}
                                        className="delete-btn"
                                    >
                                        🗑️ Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ← Предыдущая
                </button>
                <span>Страница {currentPage} из {totalPages}</span>
                <button 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Следующая →
                </button>
            </div>
        </>
    );
};

// Компонент управления серверами
const ServersManagement: React.FC<{
    servers: Server[];
    onDeleteServer: (serverId: number) => void;
}> = ({ servers, onDeleteServer }) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Владелец</th>
                        <th>Каналов</th>
                        <th>Участников</th>
                        <th>Дата создания</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {servers.map((server) => (
                        <tr key={server.id}>
                            <td>{server.id}</td>
                            <td>{server.name}</td>
                            <td>{server.description || 'Нет описания'}</td>
                            <td>{server.ownerId}</td>
                            <td>{server.channels?.length || 0}</td>
                            <td>{server.memberCount || 0}</td>
                            <td>{new Date(server.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => onDeleteServer(server.id)}
                                    className="delete-btn"
                                >
                                    🗑️ Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Компонент просмотра логов
const LogsViewer: React.FC<{ logs: any }> = ({ logs }) => {
    if (!logs) return <div>Загрузка логов...</div>;

    return (
        <div className="logs-content">
            <div className="log-section">
                <h3>🔧 Системные логи</h3>
                <pre>{logs.system || 'Нет системных логов'}</pre>
            </div>
            <div className="log-section">
                <h3>❌ Ошибки</h3>
                <pre>{logs.errors || 'Нет ошибок'}</pre>
            </div>
            <div className="log-section">
                <h3>📊 Логи доступа</h3>
                <pre>{logs.access || 'Нет логов доступа'}</pre>
            </div>
        </div>
    );
};

export default AdminPanel; 