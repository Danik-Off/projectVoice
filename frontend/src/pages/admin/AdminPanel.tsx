import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { adminService } from '../../services/adminService';
import { authStore } from '../../store/authStore';
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

const AdminPanel: React.FC = observer(() => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (authStore.user?.role !== 'admin') {
            window.location.href = '/';
            return;
        }

        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await adminService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-panel">
                <div className="admin-loading">Загрузка админ-панели...</div>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Админ-панель ProjectVoice</h1>
                <div className="admin-user-info">
                    <span>Администратор: {authStore.user?.username}</span>
                    <button onClick={() => authStore.logout()} className="logout-btn">
                        Выйти
                    </button>
                </div>
            </div>

            <div className="admin-nav">
                <button 
                    className={activeTab === 'dashboard' ? 'active' : ''}
                    onClick={() => setActiveTab('dashboard')}
                >
                    Дашборд
                </button>
                <button 
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Пользователи
                </button>
                <button 
                    className={activeTab === 'servers' ? 'active' : ''}
                    onClick={() => setActiveTab('servers')}
                >
                    Серверы
                </button>
                <button 
                    className={activeTab === 'logs' ? 'active' : ''}
                    onClick={() => setActiveTab('logs')}
                >
                    Логи
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'dashboard' && (
                    <div className="dashboard">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Пользователи</h3>
                                <div className="stat-numbers">
                                    <div className="stat-main">{stats?.users.total || 0}</div>
                                    <div className="stat-details">
                                        <span>Активных: {stats?.users.active || 0}</span>
                                        <span>Заблокированных: {stats?.users.blocked || 0}</span>
                                    </div>
                                </div>
                                <div className="stat-breakdown">
                                    <div>Админов: {stats?.users.byRole.admin || 0}</div>
                                    <div>Модераторов: {stats?.users.byRole.moderator || 0}</div>
                                    <div>Пользователей: {stats?.users.byRole.user || 0}</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3>Серверы</h3>
                                <div className="stat-numbers">
                                    <div className="stat-main">{stats?.servers.total || 0}</div>
                                    <div className="stat-details">
                                        <span>С каналами: {stats?.servers.withChannels || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3>Каналы</h3>
                                <div className="stat-numbers">
                                    <div className="stat-main">{stats?.channels.total || 0}</div>
                                    <div className="stat-details">
                                        <span>Текстовых: {stats?.channels.text || 0}</span>
                                        <span>Голосовых: {stats?.channels.voice || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <h3>Сообщения</h3>
                                <div className="stat-numbers">
                                    <div className="stat-main">{stats?.messages.total || 0}</div>
                                    <div className="stat-details">
                                        <span>Сегодня: {stats?.messages.today || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <h3>Быстрые действия</h3>
                            <div className="action-buttons">
                                <button onClick={() => setActiveTab('users')}>
                                    Управление пользователями
                                </button>
                                <button onClick={() => setActiveTab('servers')}>
                                    Просмотр серверов
                                </button>
                                <button onClick={loadStats}>
                                    Обновить статистику
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-management">
                        <h2>Управление пользователями</h2>
                        <UsersManagement />
                    </div>
                )}

                {activeTab === 'servers' && (
                    <div className="servers-management">
                        <h2>Управление серверами</h2>
                        <ServersManagement />
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="logs-viewer">
                        <h2>Системные логи</h2>
                        <LogsViewer />
                    </div>
                )}
            </div>
        </div>
    );
});

// Компонент управления пользователями
const UsersManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getUsers({ page, search, role, status });
            setUsers(data.users);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
        } finally {
            setLoading(false);
        }
    }, [page, search, role, status]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const updateUser = async (userId: number, updates: any) => {
        try {
            await adminService.updateUser(userId, updates);
            loadUsers();
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
        }
    };

    const deleteUser = async (userId: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            return;
        }

        try {
            await adminService.deleteUser(userId);
            loadUsers();
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
        }
    };

    return (
        <div className="users-management">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Поиск по имени или email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Все роли</option>
                    <option value="user">Пользователь</option>
                    <option value="moderator">Модератор</option>
                    <option value="admin">Администратор</option>
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="blocked">Заблокированные</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Загрузка пользователей...</div>
            ) : (
                <div className="users-table">
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
                            {users.map((user: any) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateUser(user.id, { role: e.target.value })}
                                        >
                                            <option value="user">Пользователь</option>
                                            <option value="moderator">Модератор</option>
                                            <option value="admin">Администратор</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            value={user.isActive ? 'active' : 'blocked'}
                                            onChange={(e) => updateUser(user.id, { isActive: e.target.value === 'active' })}
                                        >
                                            <option value="active">Активный</option>
                                            <option value="blocked">Заблокирован</option>
                                        </select>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="delete-btn"
                                            disabled={user.role === 'admin'}
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Компонент управления серверами
const ServersManagement: React.FC = () => {
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadServers();
    }, []);

    const loadServers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getServers();
            setServers(data.servers);
        } catch (error) {
            console.error('Ошибка загрузки серверов:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteServer = async (serverId: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот сервер?')) {
            return;
        }

        try {
            await adminService.deleteServer(serverId);
            loadServers();
        } catch (error) {
            console.error('Ошибка удаления сервера:', error);
        }
    };

    return (
        <div className="servers-management">
            {loading ? (
                <div className="loading">Загрузка серверов...</div>
            ) : (
                <div className="servers-grid">
                    {servers.map((server: any) => (
                        <div key={server.id} className="server-card">
                            <h3>{server.name}</h3>
                            <p>{server.description || 'Описание отсутствует'}</p>
                            <div className="server-stats">
                                <span>Каналов: {server.Channels?.length || 0}</span>
                                <span>Участников: {server.members?.length || 0}</span>
                            </div>
                            <div className="server-actions">
                                <button onClick={() => deleteServer(server.id)} className="delete-btn">
                                    Удалить сервер
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Компонент просмотра логов
const LogsViewer: React.FC = () => {
    const [logs, setLogs] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await adminService.getLogs();
            setLogs(data);
        } catch (error) {
            console.error('Ошибка загрузки логов:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="logs-viewer">
            {loading ? (
                <div className="loading">Загрузка логов...</div>
            ) : (
                <div className="logs-content">
                    <div className="log-section">
                        <h3>Системные логи</h3>
                        <pre>{logs?.system || 'Логи недоступны'}</pre>
                    </div>
                    <div className="log-section">
                        <h3>Логи ошибок</h3>
                        <pre>{logs?.errors || 'Логи недоступны'}</pre>
                    </div>
                    <div className="log-section">
                        <h3>Логи доступа</h3>
                        <pre>{logs?.access || 'Логи недоступны'}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel; 