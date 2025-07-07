import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../store/authStore';
import { API_URL } from '../../configs/apiConfig';
import notificationStore from '../../store/NotificationStore';
import './InvitePage.scss';

interface InviteData {
    id: number;
    token: string;
    serverId: number;
    maxUses: number;
    uses: number;
    expiresAt: string;
}

interface ServerData {
    id: number;
    name: string;
    description?: string;
    icon?: string;
}

const InvitePage: React.FC = observer(() => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inviteData, setInviteData] = useState<InviteData | null>(null);
    const [serverData, setServerData] = useState<ServerData | null>(null);
    const [accepting, setAccepting] = useState(false);

    const isAuthenticated = authStore.isAuthenticated;

    console.log('InvitePage rendered with token:', token);

    const fetchInviteData = useCallback(async () => {
        console.log('Fetching invite data for token:', token);
        console.log('API URL:', `${API_URL}/invite/invite/${token}`);
        
        try {
            const response = await fetch(`${API_URL}/invite/invite/${token}`);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error data:', errorData);
                throw new Error(errorData.error || 'Приглашение не найдено');
            }

            const data = await response.json();
            console.log('Invite data received:', data);
            setInviteData(data.invite);
            setServerData(data.server);
        } catch (err) {
            console.error('Error fetching invite data:', err);
            const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
            setError(errorMessage);
            notificationStore.addNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchInviteData();
        }
    }, [token, fetchInviteData]);

    const handleAcceptInvite = async () => {
        if (!isAuthenticated) {
            // Перенаправляем на страницу входа с возвратом на эту страницу
            navigate(`/auth?redirect=/invite/${token}`);
            return;
        }

        setAccepting(true);
        try {
            const response = await fetch(`${API_URL}/invite/invite/${token}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.getToken()}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка принятия приглашения');
            }

            // Перенаправляем на сервер
            navigate(`/server/${serverData?.id}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка принятия приглашения';
            setError(errorMessage);
            notificationStore.addNotification(errorMessage, 'error');
        } finally {
            setAccepting(false);
        }
    };

    const handleLogin = () => {
        navigate(`/auth?redirect=/invite/${token}`);
    };

    if (loading) {
        return (
            <div className="invite-page">
                <div className="invite-container">
                    <div className="loading">Загрузка приглашения...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="invite-page">
                <div className="invite-container">
                    <div className="error">
                        <h2>Ошибка</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Вернуться на главную
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!inviteData || !serverData) {
        return (
            <div className="invite-page">
                <div className="invite-container">
                    <div className="error">
                        <h2>Приглашение не найдено</h2>
                        <p>Возможно, приглашение истекло или было удалено.</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Вернуться на главную
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="invite-page">
            <div className="invite-container">
                <div className="invite-header">
                    <h1>Приглашение на сервер</h1>
                </div>

                <div className="server-info">
                    <div className="server-icon">
                        {serverData.icon ? (
                            <img src={serverData.icon} alt={serverData.name} />
                        ) : (
                            <span>{serverData.name.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="server-details">
                        <h2>{serverData.name}</h2>
                        {serverData.description && (
                            <p className="server-description">{serverData.description}</p>
                        )}
                    </div>
                </div>

                <div className="invite-details">
                    <div className="invite-stat">
                        <span className="label">Использований:</span>
                        <span className="value">{inviteData.uses}/{inviteData.maxUses || '∞'}</span>
                    </div>
                    {inviteData.expiresAt && (
                        <div className="invite-stat">
                            <span className="label">Истекает:</span>
                            <span className="value">
                                {new Date(inviteData.expiresAt).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="invite-actions">
                    {isAuthenticated ? (
                        <button 
                            onClick={handleAcceptInvite} 
                            disabled={accepting}
                            className="btn-accept"
                        >
                            {accepting ? 'Присоединяемся...' : 'Присоединиться к серверу'}
                        </button>
                    ) : (
                        <div className="auth-required">
                            <p>Для присоединения к серверу необходимо войти в аккаунт</p>
                            <button onClick={handleLogin} className="btn-login">
                                Войти в аккаунт
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default InvitePage; 