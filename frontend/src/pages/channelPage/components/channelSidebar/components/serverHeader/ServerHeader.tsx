// src/components/ChannelSidebar/ServerHeader.tsx
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import './ServerHeader.scss';
import serverStore from '../../../../../../store/serverStore';
import { authStore } from '../../../../../../store/authStore';
import PencilIcon from '../../../../../../icons/PencilIcon';
import { inviteService } from '../../../../../../services/inviteService';

const ServerHeader: React.FC = observer(() => {
    const currentServer = serverStore.currentServer;
    const navigate = useNavigate();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [isCreatingInvite, setIsCreatingInvite] = useState(false);

    const handleShare = async () => {
        if (!currentServer) return;
        
        setIsCreatingInvite(true);
        try {
            const invite = await inviteService.createInvite(currentServer.id);
            setInviteLink(`${window.location.origin}/invite/${invite.token}`);
            setShowInviteModal(true);
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
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        // Можно добавить уведомление об успешном копировании
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

    // Отладочная информация
    console.log('ServerHeader Debug:', {
        currentUserId,
        serverOwnerId: currentServer?.ownerId,
        isOwner,
        userMember,
        userRole,
        canEditServer: ['owner', 'admin'].includes(userRole),
        members: currentServer?.members
    });

    const canInvite = ['owner', 'admin', 'moderator'].includes(userRole);
    const canEditServer = ['owner', 'admin'].includes(userRole);

    return (
        <>
            <div className="server-header">
                {currentServer ? (
                    <>
                        <div className="server-info">
                            <span className="server-name">{currentServer.name}</span>
                            <span className="server-role">{userRole}</span>
                        </div>
                        <div className="server-actions">
                            {canInvite && (
                                <button 
                                    className="share-button" 
                                    onClick={handleShare}
                                    disabled={isCreatingInvite}
                                    title="Поделиться сервером"
                                >
                                    {isCreatingInvite ? '...' : '📤'}
                                </button>
                            )}
                            {canEditServer && (
                                <button 
                                    className="edit-button" 
                                    onClick={handleEditServer}
                                    title="Настройки сервера"
                                >
                                    <PencilIcon width={16} height={16} color="currentColor" />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <span className="no-server">No Server Selected</span>
                )}
            </div>

            {/* Модальное окно с приглашением */}
            {showInviteModal && (
                <div className="invite-modal-overlay" onClick={closeInviteModal}>
                    <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Пригласить на сервер</h3>
                        <p>Поделитесь этой ссылкой с друзьями:</p>
                        <div className="invite-link-container">
                            <input 
                                type="text" 
                                value={inviteLink} 
                                readOnly 
                                className="invite-link-input"
                            />
                            <button onClick={copyInviteLink} className="copy-button">
                                Копировать
                            </button>
                        </div>
                        <button onClick={closeInviteModal} className="close-button">
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </>
    );
});

export default ServerHeader;
