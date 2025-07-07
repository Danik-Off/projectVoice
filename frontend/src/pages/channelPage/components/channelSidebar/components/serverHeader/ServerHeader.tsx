// src/components/ChannelSidebar/ServerHeader.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import './ServerHeader.scss';
import serverStore from '../../../../../../store/serverStore';
import { authStore } from '../../../../../../store/authStore';
import PencilIcon from '../../../../../../icons/PencilIcon';

const ServerHeader: React.FC = observer(() => {
    const currentServer = serverStore.currentServer;
    const navigate = useNavigate();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [isCreatingInvite, setIsCreatingInvite] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleShare = async () => {
        if (!currentServer) return;
        
        setIsCreatingInvite(true);
        try {
            const response = await fetch(`/api/invites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.getToken()}`
                },
                body: JSON.stringify({ serverId: currentServer.id })
            });
            
            if (response.ok) {
                const invite = await response.json();
                setInviteLink(`${window.location.origin}/invite/${invite.token}`);
                setShowInviteModal(true);
            }
        } catch (error) {
            console.error('Ошибка создания приглашения:', error);
        } finally {
            setIsCreatingInvite(false);
        }
    };

    const handleEditServer = () => {
        if (currentServer) {
            navigate(`/server/${currentServer.id}/settings`);
        }
        setShowDropdown(false);
    };

    const copyInviteLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
        } catch (error) {
            console.error('Ошибка копирования:', error);
        }
    };

    const closeInviteModal = () => {
        setShowInviteModal(false);
        setInviteLink('');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
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

    if (!currentServer) {
        return (
            <div className="server-header">
                <div className="no-server-state">
                    <span className="no-server-text">Выберите сервер</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="server-header">
                <div className="server-info">
                    <div className="server-icon">
                        {currentServer.icon ? (
                            <img 
                                src={currentServer.icon} 
                                alt={`${currentServer.name} icon`} 
                            />
                        ) : (
                            <span>{currentServer.name.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    
                    <div className="server-details">
                        <h2 className="server-name">{currentServer.name}</h2>
                        <div className="server-meta">
                            <span className="server-role">
                                {getRoleIcon(userRole)} {userRole}
                            </span>
                            {currentServer.members && (
                                <span className="member-count">
                                    {currentServer.members.length} участников
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="server-actions">

                    
                    {(canEditServer || canInvite) && (
                        <div className="dropdown-container">
                            <button 
                                className="action-button menu-button"
                                onClick={toggleDropdown}
                                title="Дополнительные действия"
                            >
                                ⋯
                            </button>
                            
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    {canInvite && (
                                        <button 
                                            className="dropdown-item"
                                            onClick={handleShare}
                                            disabled={isCreatingInvite}
                                        >
                                            <span className="dropdown-icon">📤</span>
                                            Пригласить участников
                                        </button>
                                    )}
                                    
                                    {canEditServer && (
                                        <button 
                                            className="dropdown-item"
                                            onClick={handleEditServer}
                                        >
                                            <span className="dropdown-icon">⚙️</span>
                                            Настройки сервера
                                        </button>
                                    )}
                                    
                                    <button 
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <span className="dropdown-icon">❌</span>
                                        Закрыть
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно с приглашением */}
            {showInviteModal && (
                <div className="invite-modal-overlay" onClick={closeInviteModal}>
                    <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Пригласить на сервер</h3>
                            <button className="modal-close" onClick={closeInviteModal}>×</button>
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
                                    <button onClick={copyInviteLink} className="copy-button">
                                        <span className="copy-icon">📋</span>
                                        Копировать
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
        </>
    );
});

export default ServerHeader;
