import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Message } from '../../../../types/message';
import { messageStore } from '../../../../store/messageStore';
import { authStore } from '../../../../store/authStore';
import './MessageItem.scss';

interface MessageItemProps {
    message: Message;
    isFirstInGroup?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = observer(({ message, isFirstInGroup = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [showActions, setShowActions] = useState(false);
    const editInputRef = useRef<HTMLTextAreaElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);

    const currentUser = authStore.user;
    const canEdit = messageStore.canEditMessage(message);
    const canDelete = messageStore.canDeleteMessage(message);
    const isOwnMessage = currentUser?.id === message.userId;

    useEffect(() => {
        if (isEditing && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.setSelectionRange(editInputRef.current.value.length, editInputRef.current.value.length);
        }
    }, [isEditing]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(message.content);
    };

    const handleSave = async () => {
        if (editContent.trim() && editContent !== message.content) {
            try {
                await messageStore.updateMessage(message.id, editContent);
                setIsEditing(false);
            } catch (error) {
                console.error('Ошибка обновления сообщения:', error);
            }
        } else {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditContent(message.content);
    };

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
            try {
                await messageStore.deleteMessage(message.id);
            } catch (error) {
                console.error('Ошибка удаления сообщения:', error);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Сегодня';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Вчера';
        } else {
            return date.toLocaleDateString('ru-RU');
        }
    };

    if (message.isDeleted) {
        return (
            <div className="message-item deleted">
                <div className="message-content">
                    <em>Сообщение было удалено</em>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`message-item ${isOwnMessage ? 'own' : ''} ${isFirstInGroup ? 'first-in-group' : ''}`}
            ref={messageRef}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {isFirstInGroup && (
                <div className="message-header">
                    <div className="user-info">
                        <div className="avatar">
                            {message.user?.avatar ? (
                                <img src={message.user.avatar} alt={message.user.username} />
                            ) : (
                                <div className="avatar-placeholder">
                                    {message.user?.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="user-details">
                            <span className="username">{message.user?.username || 'Неизвестный пользователь'}</span>
                            <span className="timestamp">
                                {formatTime(message.createdAt)}
                                {message.isEdited && <span className="edited-indicator"> (изменено)</span>}
                            </span>
                        </div>
                    </div>
                    {(canEdit || canDelete) && showActions && (
                        <div className="message-actions">
                            {canEdit && (
                                <button 
                                    className="action-btn edit"
                                    onClick={handleEdit}
                                    title="Редактировать"
                                >
                                    ✏️
                                </button>
                            )}
                            {canDelete && (
                                <button 
                                    className="action-btn delete"
                                    onClick={handleDelete}
                                    title="Удалить"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="message-content">
                {isEditing ? (
                    <div className="edit-form">
                        <textarea
                            ref={editInputRef}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Введите сообщение..."
                            rows={Math.min(editContent.split('\n').length + 1, 10)}
                        />
                        <div className="edit-actions">
                            <button className="save-btn" onClick={handleSave}>
                                Сохранить
                            </button>
                            <button className="cancel-btn" onClick={handleCancel}>
                                Отмена
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="message-text">
                        {message.content.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                {index < message.content.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            {!isFirstInGroup && (
                <div className="message-timestamp">
                    {formatTime(message.createdAt)}
                    {message.isEdited && <span className="edited-indicator"> (изменено)</span>}
                </div>
            )}
        </div>
    );
});

export default MessageItem; 