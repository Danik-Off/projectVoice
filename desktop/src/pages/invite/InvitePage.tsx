import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { authStore } from '../../store/authStore';
import { inviteService } from '../../services/inviteService';
import notificationStore from '../../store/NotificationStore';
import './InvitePage.scss';

interface InviteData {
    id: number;
    token: string;
    serverId: number;
    maxUses?: number;
    uses: number;
    expiresAt?: string;
}

interface ServerData {
    id: number;
    name: string;
    description?: string;
    icon?: string;
}

const InvitePage: React.FC = observer(() => {
    const { t } = useTranslation();
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
        console.log('🎯 InvitePage: Получение данных приглашения для токена:', token);
        
        try {
            // Используем сервис для получения данных приглашения
            const inviteData = await inviteService.getInvite(token!);
            console.log('🎯 InvitePage: Данные приглашения получены:', inviteData);
            
            setInviteData(inviteData);
            
            // Получаем данные сервера отдельно (пока что используем заглушку)
            // TODO: Добавить метод в inviteService для получения данных сервера
            setServerData({
                id: inviteData.serverId,
                name: `Server ${inviteData.serverId}`, // Временная заглушка
                description: 'Описание сервера'
            });
        } catch (err) {
            console.error('🎯 InvitePage: Ошибка получения данных приглашения:', err);
            const errorMessage = err instanceof Error ? err.message : t('invitePage.error');
            setError(errorMessage);
            notificationStore.addNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, [token, t]);

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
            console.log('🎯 InvitePage: Принятие приглашения с токеном:', token);
            
            // Используем сервис для принятия приглашения
            await inviteService.acceptInvite(token!);
            
            console.log('🎯 InvitePage: Приглашение принято успешно');
            
            // Перенаправляем на сервер
            navigate(`/server/${serverData?.id}`);
            notificationStore.addNotification('Вы успешно присоединились к серверу!', 'success');
        } catch (err) {
            console.error('🎯 InvitePage: Ошибка принятия приглашения:', err);
            const errorMessage = err instanceof Error ? err.message : t('notifications.inviteAcceptError');
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
                    <div className="loading">{t('invitePage.loading')}</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="invite-page">
                <div className="invite-container">
                    <div className="error">
                        <h2>{t('invitePage.error')}</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            {t('invitePage.backToHome')}
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
                        <h2>{t('invitePage.error')}</h2>
                        <p>Возможно, приглашение истекло или было удалено.</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            {t('invitePage.backToHome')}
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
                    <h1>{t('invitePage.title')}</h1>
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
                            {accepting ? 'Присоединяемся...' : t('invitePage.joinServer')}
                        </button>
                    ) : (
                        <div className="auth-required">
                            <p>{t('invitePage.loginRequired')}</p>
                            <button onClick={handleLogin} className="btn-login">
                                {t('invitePage.loginButton')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default InvitePage; 