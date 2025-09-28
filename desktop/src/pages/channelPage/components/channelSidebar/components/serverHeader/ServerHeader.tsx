// src/components/ChannelSidebar/ServerHeader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import './ServerHeader.scss';
import serverStore from '../../../../../../store/serverStore';
import { authStore } from '../../../../../../store/authStore';
import notificationStore from '../../../../../../store/NotificationStore';
import { inviteService } from '../../../../../../services/inviteService';

const ServerHeader: React.FC = observer(() => {
    const currentServer = serverStore.currentServer;
    const navigate = useNavigate();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [isCreatingInvite, setIsCreatingInvite] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Позиционирование tooltip
    useEffect(() => {
        if (showTooltip && tooltipRef.current) {
            const rect = tooltipRef.current.getBoundingClientRect();
            if (rect.right > window.innerWidth - 20) {
                tooltipRef.current.style.right = '0';
                tooltipRef.current.style.left = 'auto';
            }
        }
    }, [showTooltip]);

    const handleShare = async () => {
        if (!currentServer) return;
        
        setIsCreatingInvite(true);
        try {
            console.log('🎯 ServerHeader: Создание приглашения для сервера', currentServer.id);
            
            // Используем правильный сервис для создания приглашения
            const invite = await inviteService.createInvite(currentServer.id);
            
            console.log('🎯 ServerHeader: Приглашение создано', invite);
            
            // Формируем ссылку для приглашения
            const inviteUrl = `${window.location.origin}/invite/${invite.token}`;
            setInviteLink(inviteUrl);
            setShowInviteModal(true);
            
            notificationStore.addNotification('Приглашение создано успешно', 'success');
        } catch (error) {
            console.error('🎯 ServerHeader: Ошибка создания приглашения:', error);
            notificationStore.addNotification(
                error instanceof Error ? error.message : 'Ошибка создания приглашения', 
                'error'
            );
        } finally {
            setIsCreatingInvite(false);
        }
    };

    const handleEditServer = () => {
        if (currentServer) {
            navigate(`/server/${currentServer.id}/settings`);
        }
    };

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            // Показываем уведомление об успешном копировании
            setShowTooltip(true);
            notificationStore.addNotification('Ссылка скопирована в буфер обмена', 'success');
            setTimeout(() => setShowTooltip(false), 2000);
        } catch (error) {
            console.error('Ошибка копирования:', error);
            notificationStore.addNotification('Ошибка копирования ссылки', 'error');
        }
    };

    const closeInviteModal = () => {
        setShowInviteModal(false);
        setInviteLink('');
    };

    // Проверяем права пользователя на сервере
    const currentUserId = authStore.user?.id;
    const isOwner = currentServer?.ownerId === currentUserId;
    const userMember = currentServer?.members?.find(
        (member: any) => member.userId === currentUserId
    );
    const userRole = userMember?.role || (isOwner ? 'owner' : 'member');

    const canInvite = ['owner', 'admin', 'moderator'].includes(userRole);
    const canEditServer = ['owner', 'admin'].includes(userRole);

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner': return '👑';
            case 'admin': return '🛡️';
            case 'moderator': return '⚡';
            default: return '👤';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'owner': return '#ffd700';
            case 'admin': return '#ff6b6b';
            case 'moderator': return '#4ecdc4';
            default: return '#95a5a6';
        }
    };

    if (!currentServer) {
        return (
            <div className="server-header">
                <div className="no-server-state">
                    <div className="no-server-icon">🏠</div>
                    <span className="no-server-text">Выберите сервер</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="server-header">
                <div className="server-info">
                    <div className="server-icon-container">
                        <div className="server-icon">
                            {currentServer.icon ? (
                                <img 
                                    src={currentServer.icon} 
                                    alt={`${currentServer.name} icon`} 
                                />
                            ) : (
                                <span className="server-icon-text">
                                    {currentServer.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="server-status-indicator online"></div>
                    </div>
                    
                    <div className="server-details">
                        <h2 className="server-name" title={currentServer.name}>
                            {currentServer.name}
                        </h2>
                        <div className="server-meta">
                            <div 
                                className="server-role"
                                style={{ '--role-color': getRoleColor(userRole) } as React.CSSProperties}
                            >
                                <span className="role-icon">{getRoleIcon(userRole)}</span>
                                <span className="role-text">{userRole}</span>
                            </div>
                            {currentServer.members && (
                                <div className="member-count">
                                    <span className="member-icon">👥</span>
                                    <span className="member-text">{currentServer.members.length}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="server-actions">
                    {canInvite && (
                        <button 
                            className="action-button share-button"
                            onClick={handleShare}
                            disabled={isCreatingInvite}
                            title="Пригласить участников"
                        >
                            {isCreatingInvite ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                <span className="share-icon">📤</span>
                            )}
                        </button>
                    )}
                    
                    {canEditServer && (
                        <button 
                            className="action-button settings-button"
                            onClick={handleEditServer}
                            title="Настройки сервера"
                        >
                            <span className="settings-icon">⚙️</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Модальное окно с приглашением */}
            {showInviteModal && (
                <div className="invite-modal-overlay" onClick={closeInviteModal}>
                    <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <span className="modal-icon">🎉</span>
                                <h3>Пригласить на сервер</h3>
                            </div>
                            <button className="modal-close" onClick={closeInviteModal}>
                                <span>×</span>
                            </button>
                        </div>
                        
                        <div className="modal-content">
                            <div className="server-preview">
                                <div className="server-preview-icon">
                                    {currentServer.icon ? (
                                        <img src={currentServer.icon} alt="Server icon" />
                                    ) : (
                                        <span>{currentServer.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="server-preview-info">
                                    <h4>{currentServer.name}</h4>
                                    <p>Приглашение в Discord-подобный сервер</p>
                                </div>
                            </div>
                            
                            <div className="invite-section">
                                <label>Ссылка для приглашения:</label>
                                <div className="invite-link-container">
                                    <input 
                                        type="text" 
                                        value={inviteLink} 
                                        readOnly 
                                        className="invite-link-input"
                                        placeholder="Создание ссылки..."
                                    />
                                    <button 
                                        onClick={copyInviteLink} 
                                        className="copy-button"
                                        title="Копировать ссылку"
                                    >
                                        <span className="copy-icon">📋</span>
                                        <span className="copy-text">Копировать</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="modal-footer">
                                <button onClick={closeInviteModal} className="close-button">
                                    Готово
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tooltip для уведомления о копировании */}
            {showTooltip && (
                <div className="copy-tooltip" ref={tooltipRef}>
                    <span className="tooltip-icon">✅</span>
                    <span className="tooltip-text">Ссылка скопирована!</span>
                </div>
            )}
        </>
    );
});

export default ServerHeader;
