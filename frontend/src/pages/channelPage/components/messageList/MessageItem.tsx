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

    const getInitials = (username: string) => {
        return username
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (message.isDeleted) {
        return (
            <div className="message-item system-message">
                <div className="message-content">
                    <em>Сообщение было удалено</em>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`message-item ${isOwnMessage ? 'own-message' : ''}`}
            ref={messageRef}
        >
            {isFirstInGroup && (
                <div className="message-avatar">
                    {message.user?.avatar ? (
                        <img src={message.user.avatar} alt={message.user.username} />
                    ) : (
                        getInitials(message.user?.username || 'U')
                    )}
                </div>
            )}

            <div className="message-content">
                {isFirstInGroup && (
                    <div className="message-header">
                        <span className="message-author">
                            {message.user?.username || 'Неизвестный пользователь'}
                        </span>
                        <span className="message-time">
                            {formatTime(message.createdAt)}
                            {message.isEdited && <span> (изменено)</span>}
                        </span>
                        <div className="message-status">
                            <span className="status-icon delivered">✓</span>
                        </div>
                    </div>
                )}

                {isEditing ? (
                    <div className="edit-form">
                        <textarea
                            ref={editInputRef}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Введите сообщение..."
                            rows={Math.min(editContent.split('\n').length + 1, 10)}
                            className="message-textarea"
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

                {!isFirstInGroup && (
                    <div className="message-time">
                        {formatTime(message.createdAt)}
                        {message.isEdited && <span> (изменено)</span>}
                    </div>
                )}

                {(canEdit || canDelete) && (
                    <div className="message-actions">
                        {canEdit && (
                            <button 
                                className="action-btn edit-btn"
                                onClick={handleEdit}
                                title="Редактировать"
                            >
                                ✏️
                            </button>
                        )}
                        {canDelete && (
                            <button 
                                className="action-btn delete-btn"
                                onClick={handleDelete}
                                title="Удалить"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});

export default MessageItem; 